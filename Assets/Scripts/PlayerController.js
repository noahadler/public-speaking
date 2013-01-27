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

var playerAnimation : Animation;
var playerAnimObject : GameObject;
enum AnimState { Idle, Running, Jumping }
public var animState : AnimState;

function Start () {
	jumpCooldownTimer = 0;
	jumps = jumpCount;
	correctConstraints = rigidbody.constraints;
	animState = AnimState.Idle;
	playerAnimation = gameObject.GetComponentInChildren(Animation);
	playerAnimation.Play('Idle');
	playerAnimObject = GameObject.Find('PlayerAnimation');
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
	if(inputVector.x > 0 && playerAnimObject.transform.rotation.eulerAngles.y != 90)
		playerAnimObject.transform.Rotate(0,90-playerAnimObject.transform.rotation.eulerAngles.y,0);
	if(inputVector.x < 0 && playerAnimObject.transform.rotation.eulerAngles.y != 270)
		playerAnimObject.transform.Rotate(0,270-playerAnimObject.transform.rotation.eulerAngles.y,0);
		
	if(Mathf.Abs(inputVector.x) == 0 && animState != AnimState.Idle){
		animState = AnimState.Idle;
		playerAnimation.Play('Idle');
	}
	else if(!jumping && Mathf.Abs(inputVector.x) != 0 && animState != AnimState.Running) {
		animState = AnimState.Running;
		playerAnimation.Play('running');
	}
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
	
	animState = AnimState.Jumping;
	playerAnimation.Play('jumping');
}

function OnCollisionEnter ( collision : Collision ) {
	if ( collision.other.gameObject.tag == 'Words' )
		jumps = jumpCount;
	if ( jumping )
		jumping = false;
}