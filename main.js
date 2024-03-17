import * as THREE from 'three';

// container chứa đối tượng sẽ được render
const scene = new THREE.Scene();
// tạo khối lập phương kích thước 1 đơn vị theo chiều rộng, cao và sâu
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// tạo material cho khối
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// khởi tạo đối tượng 3D dùng khối và material
const cube = new THREE.Mesh( geometry, material );
// thêm khối vào container
scene.add( cube );
// khởi tạo camera góc nhìn với các tham số: góc nhìn 75 độ, tỷ lệ khung hình, mặt cắt gần, mặt cắt xa ( xác định phạm vi hiển thị )
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 3;
// tạo một render để vẽ scene 3D
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

// tạp vòng lặp animation với 60 fps
function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();