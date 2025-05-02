import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import createCat from './Cat';
import './App.css';

export default function App() {
  /* ---------- customization state ---------- */
  const [colors, setColors] = useState({
    body: 0xff66cc,
    accent: 0x29abe2,
    eyes: 0xffffff,
  });
  const [showWings, setShowWings] = useState(false);

  /* ---------- refs ---------- */
  const mountRef = useRef(null);
  const catRef   = useRef(null);          // the cat Group
  const matsRef  = useRef(null);          // materials for live recolor
  const wingsRef = useRef([]);            // wing meshes

  /* ---------- scene setup ---------- */
  useEffect(() => {
    const container = mountRef.current;
    /* scene */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    /* camera */
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 3);

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    /* lighting */
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(3, 5, 2);
    scene.add(key);

    /* cat */
    const { group, materials, extras } = createCat({ colors });
    scene.add(group);
    catRef.current   = group;
    matsRef.current  = materials;
    wingsRef.current = extras.wings;
    /* don't add wings yet; UI toggles them */

    /* animation */
    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.6;               // spin
      group.position.y = Math.sin(t * 2) * 0.05; // bob
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    /* resize */
    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* cleanup */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  /* ---------- react-to-state updates ---------- */
  /* recolor on state change */
  useEffect(() => {
    if (!matsRef.current) return;
    matsRef.current.body.color.setHex(colors.body);
    matsRef.current.accent.color.setHex(colors.accent);
    matsRef.current.eyes.color.setHex(colors.eyes);
  }, [colors]);

  /* wings toggle */
  useEffect(() => {
    if (!catRef.current) return;
    const [wingL, wingR] = wingsRef.current;
    if (showWings) {
      catRef.current.add(wingL, wingR);
    } else {
      catRef.current.remove(wingL);
      catRef.current.remove(wingR);
    }
  }, [showWings]);

  /* ---------- UI helpers ---------- */
  const cycle = (key, palette) => {
    setColors(c => ({ ...c, [key]: palette[(palette.indexOf(c[key]) + 1) % palette.length] }));
  };

  return (
    <>
      <div ref={mountRef} className="Scene" />

      <div className="Controls">
        <button onClick={() => cycle('body', [0xff66cc, 0xffc107, 0x6effb5, 0x8c9eff])}>
          Body&nbsp;Color
        </button>
        <button onClick={() => cycle('accent', [0x29abe2, 0xff4081, 0xfff200, 0x9c27b0])}>
          Accent&nbsp;Color
        </button>
        <button onClick={() => setShowWings(w => !w)}>
          {showWings ? 'Remove Wings' : 'Add Wings'}
        </button>
      </div>
    </>
  );
}
