import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function DiamondHero3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Diamond geometry (octahedron = gem shape)
    const geo = new THREE.OctahedronGeometry(1.4, 1);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xC9A84C,
      metalness: 0.3,
      roughness: 0.05,
      transmission: 0.6,
      thickness: 1.5,
      envMapIntensity: 2,
      wireframe: false,
    });
    const diamond = new THREE.Mesh(geo, mat);
    scene.add(diamond);

    // Wireframe overlay
    const wMat = new THREE.MeshBasicMaterial({ color: 0xE8C97A, wireframe: true, opacity: 0.15, transparent: true });
    const wireMesh = new THREE.Mesh(geo, wMat);
    wireMesh.scale.setScalar(1.02);
    scene.add(wireMesh);

    // Floating particles
    const particleCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.03, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const gold = new THREE.PointLight(0xC9A84C, 3, 10);
    gold.position.set(2, 3, 2);
    scene.add(gold);
    const wine = new THREE.PointLight(0x6B1F2A, 2, 10);
    wine.position.set(-3, -2, 1);
    scene.add(wine);
    const rim = new THREE.PointLight(0xE8C97A, 1.5, 8);
    rim.position.set(0, -3, 3);
    scene.add(rim);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frame = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      canvas._animId = id;
      frame++;
      
      // Parallax easing
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      
      camera.position.x = targetX * 5;
      camera.position.y = -targetY * 5;
      camera.lookAt(0, 0, 0);

      const t = frame * 0.008 + targetX * 2;
      diamond.rotation.y = t;
      diamond.rotation.x = Math.sin(t * 0.5) * 0.3 + targetY;
      diamond.position.y = Math.sin(t * 0.7) * 0.1;
      
      wireMesh.rotation.y = t;
      wireMesh.rotation.x = Math.sin(t * 0.5) * 0.3 + targetY;
      wireMesh.position.y = diamond.position.y;
      
      particles.rotation.y = t * 0.1;
      particles.rotation.x = -targetY * 0.5;
      
      gold.position.x = Math.sin(t) * 2.5;
      gold.position.z = Math.cos(t) * 2.5;
      
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(canvas._animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      width: '100%', height: '100%',
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
    }} />
  );
}
