import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type LightingMood = 'royal_gold' | 'midnight' | 'courtroom';
export type TiltMode = 'natural' | 'right' | 'left' | 'equilibrium';

interface FixedBackgroundScale3DProps {
  motionIntensity?: number;
  tiltMode?: TiltMode;
  lightingMood?: LightingMood;
  isPaused?: boolean;
  zenMode?: boolean;
}

export const FixedBackgroundScale3D: React.FC<FixedBackgroundScale3DProps> = ({
  motionIntensity = 1.0,
  tiltMode = 'natural',
  lightingMood = 'royal_gold',
  isPaused = false,
  zenMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Mutable state reference to adjust properties inside loop without re-instantiating WebGL
  const dynamicStateRef = useRef({
    tiltMode,
    lightingMood,
    isPaused,
    motionIntensity,
  });

  useEffect(() => {
    dynamicStateRef.current.tiltMode = tiltMode;
    dynamicStateRef.current.lightingMood = lightingMood;
    dynamicStateRef.current.isPaused = isPaused;
    dynamicStateRef.current.motionIntensity = motionIntensity;
  }, [tiltMode, lightingMood, isPaused, motionIntensity]);

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

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080d1a, 0.038);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 5.0);
    camera.lookAt(0, 0.3, 0);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Studio Environment reflection using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = roomEnv;
    pmremGenerator.dispose();

    // 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3cc, 3.2);
    keyLight.position.set(4, 5.5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.4);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    rimLight.position.set(0, -1.5, -4);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0x1e293b, 0x050811, 1.2);
    scene.add(hemiLight);

    // Procedural Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb76c,
      metalness: 0.95,
      roughness: 0.17,
      envMapIntensity: 1.5,
    });

    const obsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      metalness: 0.3,
      roughness: 0.1,
      envMapIntensity: 1.2,
    });

    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.98,
      roughness: 0.1,
      envMapIntensity: 1.8,
    });

    // Master Scale Group
    const scaleGroup = new THREE.Group();
    scaleGroup.position.set(0, -0.6, 0);
    scene.add(scaleGroup);

    // Part 1: Stepped Pedestal Base (Obsidian with gold beveled rim)
    const baseGeom1 = new THREE.CylinderGeometry(0.9, 0.98, 0.13, 48);
    const baseMesh1 = new THREE.Mesh(baseGeom1, obsidianMaterial);
    baseMesh1.position.y = 0.065;
    scaleGroup.add(baseMesh1);

    const baseGeom2 = new THREE.CylinderGeometry(0.76, 0.86, 0.1, 48);
    const baseMesh2 = new THREE.Mesh(baseGeom2, obsidianMaterial);
    baseMesh2.position.y = 0.18;
    scaleGroup.add(baseMesh2);

    const goldRingGeom = new THREE.TorusGeometry(0.78, 0.022, 16, 48);
    goldRingGeom.rotateX(Math.PI / 2);
    const goldRingMesh = new THREE.Mesh(goldRingGeom, goldAccentMaterial);
    goldRingMesh.position.y = 0.23;
    scaleGroup.add(goldRingMesh);

    // Part 2: Plinth Collar & Column Base
    const plinthGeom = new THREE.CylinderGeometry(0.26, 0.34, 0.15, 32);
    const plinthMesh = new THREE.Mesh(plinthGeom, goldMaterial);
    plinthMesh.position.y = 0.30;
    scaleGroup.add(plinthMesh);

    // Part 3: Classical Column Shaft
    const columnGeom = new THREE.CylinderGeometry(0.085, 0.14, 1.55, 32);
    const columnMesh = new THREE.Mesh(columnGeom, goldMaterial);
    columnMesh.position.y = 1.15;
    scaleGroup.add(columnMesh);

    // Mid-Ring Accents on Column
    const midRingGeom = new THREE.TorusGeometry(0.13, 0.02, 16, 32);
    midRingGeom.rotateX(Math.PI / 2);
    const midRingMesh = new THREE.Mesh(midRingGeom, goldAccentMaterial);
    midRingMesh.position.y = 1.12;
    scaleGroup.add(midRingMesh);

    // Part 4: Column Capital
    const capitalGeom = new THREE.CylinderGeometry(0.22, 0.12, 0.14, 32);
    const capitalMesh = new THREE.Mesh(capitalGeom, goldMaterial);
    capitalMesh.position.y = 1.98;
    scaleGroup.add(capitalMesh);

    // Apex Finial Sphere & Tip
    const finialSphereGeom = new THREE.SphereGeometry(0.1, 24, 24);
    const finialSphere = new THREE.Mesh(finialSphereGeom, goldAccentMaterial);
    finialSphere.position.y = 2.12;
    scaleGroup.add(finialSphere);

    const finialTipGeom = new THREE.ConeGeometry(0.048, 0.24, 24);
    const finialTip = new THREE.Mesh(finialTipGeom, goldAccentMaterial);
    finialTip.position.y = 2.27;
    scaleGroup.add(finialTip);

    // Part 5: Pivot Joint & Crossbeam (Tilting Balance Bar)
    const beamAssembly = new THREE.Group();
    beamAssembly.position.set(0, 1.98, 0); // pivot axis
    scaleGroup.add(beamAssembly);

    // Crossbeam Bar
    const beamGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.05, 32);
    beamGeom.rotateZ(Math.PI / 2);
    const beamMesh = new THREE.Mesh(beamGeom, goldMaterial);
    beamAssembly.add(beamMesh);

    // Central Medallion Emblem
    const medallionGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.045, 32);
    medallionGeom.rotateX(Math.PI / 2);
    const medallionMesh = new THREE.Mesh(medallionGeom, goldAccentMaterial);
    beamAssembly.add(medallionMesh);

    // Left and Right Pivot Rings
    const beamHalfWidth = 0.98;
    const endRingGeom = new THREE.TorusGeometry(0.055, 0.015, 16, 24);

    const leftPivotMesh = new THREE.Mesh(endRingGeom, goldAccentMaterial);
    leftPivotMesh.position.set(-beamHalfWidth, 0, 0);
    beamAssembly.add(leftPivotMesh);

    const rightPivotMesh = new THREE.Mesh(endRingGeom, goldAccentMaterial);
    rightPivotMesh.position.set(beamHalfWidth, 0, 0);
    beamAssembly.add(rightPivotMesh);

    // Left & Right Hanging Suspended Pan Assemblies
    const leftHangingGroup = new THREE.Group();
    leftHangingGroup.position.set(-beamHalfWidth, 0, 0);
    beamAssembly.add(leftHangingGroup);

    const rightHangingGroup = new THREE.Group();
    rightHangingGroup.position.set(beamHalfWidth, 0, 0);
    beamAssembly.add(rightHangingGroup);

    // Lathe Scale Pan Dish
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      const radius = 0.34 * Math.sin((u * Math.PI) / 2);
      const y = -0.13 * Math.cos((u * Math.PI) / 2);
      points.push(new THREE.Vector2(radius, y));
    }
    const panGeom = new THREE.LatheGeometry(points, 32);
    const rimGeom = new THREE.TorusGeometry(0.34, 0.012, 16, 32);
    rimGeom.rotateX(Math.PI / 2);

    const createPan = () => {
      const group = new THREE.Group();
      const panMesh = new THREE.Mesh(panGeom, goldMaterial);
      panMesh.position.y = -0.92;
      group.add(panMesh);

      const rimMesh = new THREE.Mesh(rimGeom, goldAccentMaterial);
      rimMesh.position.y = -0.92;
      group.add(rimMesh);

      // 3 Suspension Chains
      const chainRadius = 0.32;
      for (let c = 0; c < 3; c++) {
        const theta = (c * (2 * Math.PI)) / 3;
        const targetX = Math.cos(theta) * chainRadius;
        const targetZ = Math.sin(theta) * chainRadius;

        const chainCurve = new THREE.LineCurve3(
          new THREE.Vector3(0, -0.04, 0),
          new THREE.Vector3(targetX, -0.92, targetZ)
        );
        const chainGeom = new THREE.TubeGeometry(chainCurve, 12, 0.0075, 6, false);
        const chainMesh = new THREE.Mesh(chainGeom, goldAccentMaterial);
        group.add(chainMesh);
      }
      return group;
    };

    const leftPan = createPan();
    leftHangingGroup.add(leftPan);

    const rightPan = createPan();
    rightHangingGroup.add(rightPan);

    // Floating Golden Dust Particles
    const particleCount = isSoftwareGl ? 40 : 90;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 5.5;
      particlePositions[p * 3 + 1] = Math.random() * 3.6 - 0.8;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 4.5;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pctx = pCanvas.getContext('2d');
    if (pctx) {
      const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      grad.addColorStop(0.35, 'rgba(212, 175, 55, 0.5)');
      grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      pctx.fillStyle = grad;
      pctx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTex,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Ground Shadow
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 128;
    sCanvas.height = 128;
    const sctx = sCanvas.getContext('2d');
    if (sctx) {
      const sgrad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      sgrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      sgrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      sgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sctx.fillStyle = sgrad;
      sctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(sCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.59;
    scene.add(shadowPlane);

    // Natural Motion & Physics State
    const state = {
      targetTilt: 0,
      currentTilt: 0,
      rotationY: 0,
      targetCameraY: 1.2,
      targetCameraX: 0,
      scrollProgress: 0,
      pointerX: 0,
      pointerY: 0,
    };

    // Scroll listener for dynamic parallax depth
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const currentScroll = window.scrollY;
      state.scrollProgress = currentScroll / maxScroll;
      state.targetCameraY = 1.2 + state.scrollProgress * 0.6;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Pointer movement
    const handlePointerMove = (e: MouseEvent) => {
      state.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
      state.targetCameraX = state.pointerX * 0.35;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.08);
      const time = clock.getElapsedTime();
      const currentProps = dynamicStateRef.current;

      // Dynamic Lighting Adaptation
      if (currentProps.lightingMood === 'midnight') {
        keyLight.color.setHex(0x93c5fd);
        keyLight.intensity = 2.4;
        fillLight.color.setHex(0x1e3a8a);
        rimLight.color.setHex(0x60a5fa);
      } else if (currentProps.lightingMood === 'courtroom') {
        keyLight.color.setHex(0xffffff);
        keyLight.intensity = 3.6;
        fillLight.color.setHex(0xe2e8f0);
        rimLight.color.setHex(0xf8fafc);
      } else {
        // Royal Gold default
        keyLight.color.setHex(0xfff3cc);
        keyLight.intensity = 3.2;
        fillLight.color.setHex(0x60a5fa);
        rimLight.color.setHex(0xd4af37);
      }

      // Continuous Rotation if not paused
      if (!currentProps.isPaused) {
        state.rotationY += 0.12 * delta;
      }
      const interactiveRotY = state.rotationY + (state.scrollProgress * 1.5) + (state.pointerX * 0.15);
      scaleGroup.rotation.y = interactiveRotY;

      // Tilt Calculation based on mode
      let targetTiltAngle = 0;
      if (currentProps.tiltMode === 'right') {
        targetTiltAngle = 0.14; // weigh right
      } else if (currentProps.tiltMode === 'left') {
        targetTiltAngle = -0.14; // weigh left
      } else if (currentProps.tiltMode === 'equilibrium') {
        targetTiltAngle = 0;
      } else {
        // Natural harmonic waves
        const primarySway = Math.sin(time * 1.25) * 0.065;
        const secondarySway = Math.cos(time * 0.62) * 0.025;
        const microJitter = Math.sin(time * 2.8) * 0.008;
        targetTiltAngle = (primarySway + secondarySway + microJitter) * currentProps.motionIntensity;
      }

      state.currentTilt = THREE.MathUtils.damp(state.currentTilt, targetTiltAngle, 3.2, delta);
      beamAssembly.rotation.z = state.currentTilt;

      // Counter-tilt hanging pans
      const panCompensation = -state.currentTilt;
      leftHangingGroup.rotation.z = panCompensation + Math.sin(time * 1.8) * 0.012;
      rightHangingGroup.rotation.z = panCompensation - Math.sin(time * 1.8) * 0.012;

      // Vertical float / breathing
      scaleGroup.position.y = -0.6 + Math.sin(time * 0.9) * 0.025 - (state.scrollProgress * 0.35);

      // Particles drift upward
      const pos = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.002;
        if (pos[i * 3 + 1] > 2.8) {
          pos[i * 3 + 1] = -0.8;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x = THREE.MathUtils.damp(camera.position.x, state.targetCameraX, 2.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, state.targetCameraY, 2.5, delta);
      camera.lookAt(0, 0.35 - (state.scrollProgress * 0.2), 0);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 50);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

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
      panGeom.dispose();
      rimGeom.dispose();
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
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none select-none overflow-hidden transition-all duration-700 ${
        zenMode ? 'opacity-100' : 'opacity-90'
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Atmospheric Subtle Vignette Scrim */}
      <div
        className={`absolute inset-0 bg-radial from-transparent via-[#080d1a]/40 to-[#080d1a]/90 pointer-events-none transition-opacity duration-700 ${
          zenMode ? 'opacity-20' : 'opacity-100'
        }`}
      />
    </div>
  );
};
