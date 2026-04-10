import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface Model3DProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Model3D({ src, className = "", style }: Model3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;

    // ── KTX2 + Draco decoders (needed for compressed GLBs) ──────────────────
    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/")
      .detectSupport(renderer);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

    // ── GLTF Loader ──────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.setDRACOLoader(dracoLoader);

    // ── Scene & fallback camera ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.01,
      2000
    );
    camera.position.set(0, 0, 5);

    // ── Lights ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(5, 10, 5);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xfdfcfb, 1.5);
    dirLight2.position.set(-5, 4, -4);
    scene.add(dirLight2);

    // ── State ────────────────────────────────────────────────────────────────
    let mixer: THREE.AnimationMixer | null = null;
    let animFrameId = 0;
    const clock = new THREE.Clock();

    // ── Resize helper ────────────────────────────────────────────────────────
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── Render loop ──────────────────────────────────────────────────────────
    const tick = () => {
      animFrameId = requestAnimationFrame(tick);
      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
    };

    // ── Load GLB ─────────────────────────────────────────────────────────────
    loader.load(
      src,
      (gltf) => {
        scene.add(gltf.scene);

        // Find embedded PerspectiveCamera by traversing scene graph
        let glbCam: THREE.PerspectiveCamera | null = null;
        gltf.scene.traverse((obj) => {
          if (!glbCam && obj instanceof THREE.PerspectiveCamera) {
            glbCam = obj;
          }
        });
        // Fallback: check gltf.cameras array
        if (!glbCam && gltf.cameras?.length > 0) {
          const c = gltf.cameras[0];
          if (c instanceof THREE.PerspectiveCamera) glbCam = c;
        }

        if (glbCam) {
          glbCam.updateWorldMatrix(true, false);
          // Replace the default camera with the GLB camera
          camera = glbCam;
          resize();
        }

        // Start all animations in infinite loop
        if (gltf.animations?.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            mixer!.clipAction(clip).setLoop(THREE.LoopRepeat, Infinity).play();
          });
        }

        tick();
      },
      undefined,
      (err) => {
        console.error("[Model3D] Load error:", err);
        tick();
      }
    );

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animFrameId);
      ro.disconnect();
      mixer?.stopAllAction();
      ktx2Loader.dispose();
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, [src]);

  return (
    <div className={`w-full h-full ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
