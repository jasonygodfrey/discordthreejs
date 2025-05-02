// Builds a cat and returns { group, materials, extras }
import * as THREE from 'three';

export default function createCat({ colors }) {
  const group = new THREE.Group();

  /* ----- materials saved so we can recolor on the fly ----- */
  const materials = {
    body: new THREE.MeshStandardMaterial({ color: colors.body }),
    accent: new THREE.MeshStandardMaterial({ color: colors.accent }),
    eyes: new THREE.MeshStandardMaterial({ color: colors.eyes })
  };

  /* ----- body parts ----- */
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.0), materials.body);
  body.position.y = 0;
  group.add(body);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), materials.body);
  head.position.set(0, 0.9, 0);
  group.add(head);

  // ears
  const earGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const earL = new THREE.Mesh(earGeo, materials.accent);
  const earR = earL.clone();
  earL.position.set(-0.35, 1.4, -0.15);
  earR.position.set(0.35, 1.4, -0.15);
  group.add(earL, earR);

  // eyes
  const eyeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.02);
  const eyeL = new THREE.Mesh(eyeGeo, materials.eyes);
  const eyeR = eyeL.clone();
  eyeL.position.set(-0.22, 0.95, 0.46);
  eyeR.position.set(0.22, 0.95, 0.46);
  group.add(eyeL, eyeR);

  // tail
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.0), materials.accent);
  tail.position.set(0, 0.2, -0.95);
  tail.rotation.x = 0.5;
  group.add(tail);

  /* ----- optional extras (wings, hat, …) kept in a map ----- */
  const extras = {};

  const wingGeo = new THREE.BoxGeometry(1, 0.1, 0.4);
  const wingL = new THREE.Mesh(wingGeo, materials.accent);
  const wingR = wingL.clone();
  wingL.position.set(-0.9, 0.3, 0);
  wingR.position.set(0.9, 0.3, 0);
  wingL.rotation.z = 0.2;
  wingR.rotation.z = -0.2;
  extras.wings = [wingL, wingR];

  return { group, materials, extras };
}
