#pragma strict
var jumpVelocity : int = 30;
var jumpButtonDown : boolean = false;
var jumping : boolean = false;
var jumpCooldown : float = 0.5;
var jumpCount : int = 2;
var jumps : int;
private var jumpCooldownTimer : float;
//var jump

var extraJumpVelocity : float = 10;
var runMaxVelocity : float = 30;
var airControlFactor : float = 0.75;


function Start () {
	jumpCooldownTimer = 0;
	jumps = jumpCount;
	correctConstraints = rigidbody.constraints;
}

//var constrained  = RigidbodyConstraints.FreezePositionX | RigidbodyConstraints.FreezePositionY | RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
var correctConstraints : RigidbodyConstraints;

function Update () {
	var inputVector : Vector3 = new Vector3(Input.GetAxis('Horizontal'), 0, 0);
	
	if ( rigidbody.constraints != correctConstraints && (inputVector != Vector3.zero || Input.GetButtonDown('Jump') ) )
		rigidbody.constraints = correctConstraints;
	
	if ( Input.GetButtonDown('Jump') && jumpCooldownTimer <= 0 && jumps > 0 )
		TryJump();
	else if ( jumpCooldownTimer > 0 )
		jumpCooldownTimer -= Time.deltaTime;
		
	transform.position += inputVector*1.4;
}

function TryJump() {
/*
	var rigidBody : Rigidbody = player.GetComponent(typeof(Rigidbody));
	var raycastHit : RaycastHit;
	if (rigidBody.SweepTest(Vector3.down, raycastHit, 5) == true) {
		rigidBody.AddForce(10 * Vector3.up, ForceMode.Impulse);
	}*/
	jumps --;
	jumpCooldownTimer = jumpCooldown;
	jumping = true;
	rigidbody.AddForce(jumpVelocity * Vector3.up, ForceMode.Impulse);
}

function OnCollisionEnter ( collision : Collision ) {
	if ( collision.other.gameObject.tag == 'Words' )
		jumps = jumpCount;
	if ( jumping )
		jumping = false;
}