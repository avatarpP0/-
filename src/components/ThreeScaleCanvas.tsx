import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Compass, Sliders, Eye } from 'lucide-react';
import { Language } from '../types';

interface ThreeScaleCanvasProps {
  language: Language;
}

export const ThreeScaleCanvas: React.FC<ThreeScaleCanvasProps> = ({ language }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [balanceState, setBalanceState] = useState<'neutral' | 'right' | 'left'>('neutral');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // References to keep animation loop synchronized without re-mounting
  const stateRef = useRef({
    balanceTargetAngle: 0,
    currentAngle: 0,
    autoRotate: true,
    isSoftwareGl: false,
    pointerX: 0,
    pointerY: 0,
    targetRotationY: 0,
    currentRotationY: 0,
    isDragging: false,
    lastMouseX: 0,
  });

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    let angle = 0;
    if (balanceState === 'right') angle = 0.14; // ~8 deg
    if (balanceState === 'left') angle = -0.14;
    stateRef.current.balanceTargetAngle = angle;
  }, [balanceState]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();
    stateRef.current.isSoftwareGl = isSoftwareGl;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080d1a, 0.045);

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.4, 4.4);
    camera.lookAt(0, 0.4, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio Environment map using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = roomEnv;
    pmremGenerator.dispose();

    // Studio 3-point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfffae0, 2.8);
    keyLight.position.set(3.5, 5, 3.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    fillLight.position.set(-3.5, 2.5, -2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.2);
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0x0f172a, 0x020617, 1.0);
    scene.add(hemiLight);

    // Procedural Materials
    // 1. Brushed Royal Gold
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb76c,
      metalness: 0.94,
      roughness: 0.18,
      envMapIntensity: 1.4,
    });

    // 2. Obsidian / Dark Polish Marble Base
    const obsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c1222,
      metalness: 0.25,
      roughness: 0.12,
      envMapIntensity: 1.1,
    });

    // 3. Subtle Accent Trim Gold
    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.98,
      roughness: 0.12,
      envMapIntensity: 1.6,
    });

    // Composite Procedural Model: Master Scales of Justice (THREE.Group)
    const scaleGroup = new THREE.Group();
    scaleGroup.position.set(0, -0.65, 0);
    scene.add(scaleGroup);

    // Part 1: Stepped Pedestal Base (Obsidian with gold rim)
    const baseGeom1 = new THREE.CylinderGeometry(0.85, 0.92, 0.12, 48);
    const baseMesh1 = new THREE.Mesh(baseGeom1, obsidianMaterial);
    baseMesh1.position.y = 0.06;
    scaleGroup.add(baseMesh1);

    const baseGeom2 = new THREE.CylinderGeometry(0.72, 0.82, 0.1, 48);
    const baseMesh2 = new THREE.Mesh(baseGeom2, obsidianMaterial);
    baseMesh2.position.y = 0.17;
    scaleGroup.add(baseMesh2);

    const goldRingGeom = new THREE.TorusGeometry(0.74, 0.02, 16, 48);
    goldRingGeom.rotateX(Math.PI / 2);
    const goldRingMesh = new THREE.Mesh(goldRingGeom, goldAccentMaterial);
    goldRingMesh.position.y = 0.22;
    scaleGroup.add(goldRingMesh);

    // Part 2: Plinth Collar & Column Base
    const plinthGeom = new THREE.CylinderGeometry(0.24, 0.32, 0.14, 32);
    const plinthMesh = new THREE.Mesh(plinthGeom, goldMaterial);
    plinthMesh.position.y = 0.29;
    scaleGroup.add(plinthMesh);

    // Part 3: Main Fluted Column
    const columnGeom = new THREE.CylinderGeometry(0.08, 0.13, 1.45, 32);
    const columnMesh = new THREE.Mesh(columnGeom, goldMaterial);
    columnMesh.position.y = 1.08;
    scaleGroup.add(columnMesh);

    // Decorative mid-rings on column
    const midRingGeom = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
    midRingGeom.rotateX(Math.PI / 2);
    const midRingMesh = new THREE.Mesh(midRingGeom, goldAccentMaterial);
    midRingMesh.position.y = 1.05;
    scaleGroup.add(midRingMesh);

    // Part 4: Capital & Apex Finial
    const capitalGeom = new THREE.CylinderGeometry(0.2, 0.11, 0.12, 32);
    const capitalMesh = new THREE.Mesh(capitalGeom, goldMaterial);
    capitalMesh.position.y = 1.86;
    scaleGroup.add(capitalMesh);

    // Apex Finial Spike & Sphere
    const finialSphereGeom = new THREE.SphereGeometry(0.09, 24, 24);
    const finialSphere = new THREE.Mesh(finialSphereGeom, goldAccentMaterial);
    finialSphere.position.y = 2.0;
    scaleGroup.add(finialSphere);

    const finialTipGeom = new THREE.ConeGeometry(0.045, 0.22, 24);
    const finialTip = new THREE.Mesh(finialTipGeom, goldAccentMaterial);
    finialTip.position.y = 2.14;
    scaleGroup.add(finialTip);

    // Part 5: Pivot Joint & Crossbeam (Dynamic Tilting Assembly)
    const beamAssembly = new THREE.Group();
    beamAssembly.position.set(0, 1.86, 0); // pivot center
    scaleGroup.add(beamAssembly);

    // Crossbeam Bar
    const beamGeom = new THREE.CylinderGeometry(0.038, 0.038, 1.85, 32);
    beamGeom.rotateZ(Math.PI / 2);
    const beamMesh = new THREE.Mesh(beamGeom, goldMaterial);
    beamAssembly.add(beamMesh);

    // Central Emblem / Crest Medallion at beam center
    const medallionGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.04, 32);
    medallionGeom.rotateX(Math.PI / 2);
    const medallionMesh = new THREE.Mesh(medallionGeom, goldAccentMaterial);
    beamAssembly.add(medallionMesh);

    // Left & Right End Pivot Rings
    const beamHalfWidth = 0.88;
    const endRingGeom = new THREE.TorusGeometry(0.05, 0.014, 16, 24);

    const leftPivotMesh = new THREE.Mesh(endRingGeom, goldAccentMaterial);
    leftPivotMesh.position.set(-beamHalfWidth, 0, 0);
    beamAssembly.add(leftPivotMesh);

    const rightPivotMesh = new THREE.Mesh(endRingGeom, goldAccentMaterial);
    rightPivotMesh.position.set(beamHalfWidth, 0, 0);
    beamAssembly.add(rightPivotMesh);

    // Left Hanging Pan Assembly
    const leftHangingGroup = new THREE.Group();
    leftHangingGroup.position.set(-beamHalfWidth, 0, 0);
    beamAssembly.add(leftHangingGroup);

    // Right Hanging Pan Assembly
    const rightHangingGroup = new THREE.Group();
    rightHangingGroup.position.set(beamHalfWidth, 0, 0);
    beamAssembly.add(rightHangingGroup);

    // Function to build a suspension pan with 3 chains and golden dish
    const createPanStructure = () => {
      const group = new THREE.Group();

      // Golden Scale Pan Dish (Concave bowl using LatheGeometry)
      const points: THREE.Vector2[] = [];
      for (let i = 0; i <= 14; i++) {
        const u = i / 14;
        const radius = 0.32 * Math.sin((u * Math.PI) / 2);
        const y = -0.12 * Math.cos((u * Math.PI) / 2);
        points.push(new THREE.Vector2(radius, y));
      }
      const panGeom = new THREE.LatheGeometry(points, 32);
      const panMesh = new THREE.Mesh(panGeom, goldMaterial);
      panMesh.position.y = -0.85;
      group.add(panMesh);

      // Gold rim lip on pan
      const rimGeom = new THREE.TorusGeometry(0.32, 0.012, 16, 32);
      rimGeom.rotateX(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeom, goldAccentMaterial);
      rimMesh.position.y = -0.85;
      group.add(rimMesh);

      // 3 Suspension Lines (golden chains from pivot to pan rim)
      const chainRadius = 0.30;
      for (let c = 0; c < 3; c++) {
        const theta = (c * (2 * Math.PI)) / 3;
        const targetX = Math.cos(theta) * chainRadius;
        const targetZ = Math.sin(theta) * chainRadius;

        const chainCurve = new THREE.LineCurve3(
          new THREE.Vector3(0, -0.04, 0),
          new THREE.Vector3(targetX, -0.85, targetZ)
        );
        const chainGeom = new THREE.TubeGeometry(chainCurve, 12, 0.007, 6, false);
        const chainMesh = new THREE.Mesh(chainGeom, goldAccentMaterial);
        group.add(chainMesh);
      }

      return group;
    };

    const leftPan = createPanStructure();
    leftHangingGroup.add(leftPan);

    const rightPan = createPanStructure();
    rightHangingGroup.add(rightPan);

    // Floating Golden Dust / Ambient Particulate Field
    const particleCount = isSoftwareGl ? 35 : 75;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 3.8;
      particlePositions[p * 3 + 1] = Math.random() * 2.6 - 0.3;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 3.8;
      particleScales[p] = Math.random() * 0.03 + 0.015;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite using procedural CanvasTexture
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pctx = particleCanvas.getContext('2d');
    if (pctx) {
      const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(254, 240, 138, 1)');
      grad.addColorStop(0.4, 'rgba(212, 175, 55, 0.6)');
      grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      pctx.fillStyle = grad;
      pctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Contact Ground Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d');
    if (sctx) {
      const sgrad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      sgrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      sgrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      sgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sctx.fillStyle = sgrad;
      sctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.64;
    scene.add(shadowPlane);

    // Pointer Interaction Listeners
    const handlePointerDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastMouseX = e.clientX;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.pointerX = x;
      stateRef.current.pointerY = y;

      if (stateRef.current.isDragging) {
        const deltaX = e.clientX - stateRef.current.lastMouseX;
        stateRef.current.targetRotationY += deltaX * 0.008;
        stateRef.current.lastMouseX = e.clientX;
      }
    };

    const handlePointerUp = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Touch Support for Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        stateRef.current.isDragging = true;
        stateRef.current.lastMouseX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && stateRef.current.isDragging) {
        const deltaX = e.touches[0].clientX - stateRef.current.lastMouseX;
        stateRef.current.targetRotationY += deltaX * 0.008;
        stateRef.current.lastMouseX = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Smooth Exponential Damping & Software WebGL Pacing
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Auto rotation
      if (stateRef.current.autoRotate && !stateRef.current.isDragging) {
        stateRef.current.targetRotationY += 0.35 * delta;
      }

      // Smooth camera/model damp
      stateRef.current.currentRotationY = THREE.MathUtils.damp(
        stateRef.current.currentRotationY,
        stateRef.current.targetRotationY,
        4.0,
        delta
      );
      scaleGroup.rotation.y = stateRef.current.currentRotationY;

      // Subtle float oscillation
      scaleGroup.position.y = -0.65 + Math.sin(time * 1.2) * 0.02;

      // Tilting crossbeam physics
      const targetAngle = stateRef.current.balanceTargetAngle;
      // Add delicate natural pendulum oscillation
      const naturalOscillation = Math.sin(time * 2.2) * 0.015;
      stateRef.current.currentAngle = THREE.MathUtils.damp(
        stateRef.current.currentAngle,
        targetAngle + naturalOscillation,
        3.5,
        delta
      );

      beamAssembly.rotation.z = stateRef.current.currentAngle;

      // Keep pans hanging vertically under gravity
      // Compensate beam rotation so pans remain level
      leftHangingGroup.rotation.z = -stateRef.current.currentAngle + Math.sin(time * 2.5) * 0.01;
      rightHangingGroup.rotation.z = -stateRef.current.currentAngle - Math.sin(time * 2.5) * 0.01;

      // Slow drift for gold particles
      const pos = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.0015;
        if (pos[i * 3 + 1] > 2.3) {
          pos[i * 3 + 1] = -0.3;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Subtle reactive camera parallax from pointer
      camera.position.x = THREE.MathUtils.damp(camera.position.x, stateRef.current.pointerX * 0.35, 2.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.4 + stateRef.current.pointerY * 0.25, 2.5, delta);
      camera.lookAt(0, 0.4, 0);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        // Safe paced callback for software gl
        frameId = window.setTimeout(tick, 45);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      baseGeom1.dispose();
      baseGeom2.dispose();
      goldRingGeom.dispose();
      plinthGeom.dispose();
      columnGeom.dispose();
      midRingGeom.dispose();
      capitalGeom.dispose();
      finialSphereGeom.dispose();
      finialTipGeom.dispose();
      beamGeom.dispose();
      medallionGeom.dispose();
      endRingGeom.dispose();
      particleGeom.dispose();
      roomEnv.dispose();
      goldMaterial.dispose();
      obsidianMaterial.dispose();
      goldAccentMaterial.dispose();
      particleMat.dispose();
      shadowMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="relative w-full h-[460px] md:h-[540px] flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        title={language === 'ar' ? 'اسحب لتدوير ميزان العدالة 3D' : 'Drag to rotate the 3D Scale of Justice'}
      />

      {/* Subtle Drag Hint Overlay */}
      <div
        className={`absolute top-4 left-4 transition-opacity duration-300 pointer-events-none px-3 py-1.5 rounded-md bg-slate-900/80 border border-amber-500/20 text-xs text-amber-200/80 flex items-center gap-2 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}
      >
        <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>{language === 'ar' ? 'ميزان العدالة التفاعلي (3D)' : 'Interactive 3D Scales of Justice'}</span>
      </div>

      {/* Ergonomic Sleek Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-amber-500/20 rounded-xl shadow-2xl backdrop-blur-md z-10 max-w-[94%]">
        {/* Preset 1: Equilibrium */}
        <button
          onClick={() => setBalanceState('neutral')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            balanceState === 'neutral'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title={language === 'ar' ? 'توازن متكافئ للأدلة' : 'Neutral Equilibrium'}
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ar' ? 'توازن الأدلة' : 'Equilibrium'}</span>
        </button>

        {/* Preset 2: Right Tilt */}
        <button
          onClick={() => setBalanceState('right')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            balanceState === 'right'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title={language === 'ar' ? 'ترجيح كفة الحق' : 'Favor Right Proof'}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ar' ? 'ترجيح الحق' : 'Right Proof'}</span>
        </button>

        {/* Preset 3: Left Tilt */}
        <button
          onClick={() => setBalanceState('left')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            balanceState === 'left'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title={language === 'ar' ? 'قوة البينة' : 'Favor Left Proof'}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ar' ? 'قوة البينة' : 'Left Proof'}</span>
        </button>

        {/* Toggle Auto Rotation */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-lg text-xs transition-all ${
            autoRotate
              ? 'text-amber-400 bg-amber-500/10'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
          }`}
          title={language === 'ar' ? (autoRotate ? 'إيقاف الدوران التلقائي' : 'تشغيل الدوران التلقائي') : 'Toggle Auto-Rotation'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>
    </div>
  );
};
