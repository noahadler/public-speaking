#pragma strict
public var vMax : Vector2 = Vector2 ( 2.0, 2.0 );
public var linAccel : Vector2 = Vector2 ( 0.1, 0.3 );
public var expAccel : Vector2 = Vector2 ( 1.0, 1.0 );
public var gripStrength : float = 1.0;
public var airControlFactor : float = 0.5;
public var zLocation : int = 0;

public var platform : GameObject;

private var grounded : boolean;
private var aimController : AimController;
public var aimControllerHolder : Camera;
private var initialized : boolean = false;

function Start ( ) {
}

function Init ( ) {
	position = transform.position;
	direction = Vector2.zero;
	velocity = rigidbody.velocity;
	lastPosition = position;
	state = State.Falling;
	grounded = false;
	xMotion = XMotion.Idling;
	jumpCount = 0;
	platform = null;
	jumpTimer = jumpTimeOut;
	aimControllerHolder = GameObject.FindGameObjectWithTag('MainCamera').GetComponent(Camera);
	if( !aimController ) {
		aimController = aimControllerHolder.GetComponent ( AimController );
		Debug.Log ( 'Got AimController in MotionController' );
		Debug.Log(aimController);
	}
	
	initialized = true;
}

private var playerForward : Vector3;
function Update ( ) {
	if ( !initialized ) {
		Init( );
	}
	//Debug.Log(aimController);
	if ( aimController ) {
		playerForward = aimController.GetForward ( );
		//Debug.Log ( 'Updated playerForward to ' + playerForward );
	}
	//Debug.Log("Velocity at start of update is "+velocity);
	motion = Vector3.zero;
	// update motion state based on input
	if ( state != State.Hanging ) {
		if ( Input.GetKey( KeyCode.D ) && Input.GetKey( KeyCode.A ) ) {
			xMotion = XMotion.Idling;
		}
		else if ( !Input.GetKey( KeyCode.D ) && !Input.GetKey( KeyCode.A ) ) {
			xMotion = XMotion.Idling;
		}	
		else if ( Input.GetKey( KeyCode.D ) ) {
			xMotion = XMotion.Right;
		}
		else if ( Input.GetKey( KeyCode.A ) ) {
			xMotion = XMotion.Left;
		} 
		// update character state based on input and motion state
		if( state != State.Clinging ) {
			if ( Input.GetKeyDown( KeyCode.Space ) && jumpCount < jumps && jumpTimer >= jumpTimeOut ) {
				StartJump( );
			}
			else if ( Input.GetKey ( KeyCode.Space ) && jumpTimer < jumpTimeOut ) {
				jumpTimer += Time.deltaTime;
			}
		}
		else if ( state == State.Clinging && !Input.GetKey ( KeyCode.Space ) ) {
			state = State.Falling;
		}
	}
		// upate character state based on current location
	if ( grounded && Mathf.Abs( position.x - platform.transform.position.x ) >= platform.renderer.bounds.size.x / 2 ) {
		Debug.Log("Falling!");
		grounded = false;
		platform = null;
		StartFall( );
	}
}

private var position : Vector3;
function GetPosition ( ) { return position; }
private var direction : Vector3;
function GetDirection ( ) { return direction; }
private var velocity : Vector3;
function GetVelocity ( ) { return velocity; }
private var lastPosition : Vector3;
function GetLastPosition ( ) { return lastPosition; }
private var clinging : boolean;
function GetClinging ( ) { return clinging; }

enum State { Idling, Walking, Running, Jumping, Falling, Clinging, Hanging}
public var state : State;

enum XMotion { Idling, Left, Right }
public var xMotion : XMotion;


function LateUpdate ( ) {
	transform.rotation = Quaternion.identity;
}
private var motion : Vector3 = Vector3.zero;
function FixedUpdate ( ) {
	if ( !initialized ) {
		Init( );
	}
	// handle current state
	// doing so may update the state
	switch( state ){
		case State.Idling:
			Idle( );
			break;
		case State.Walking:
			Walk( );	
			break;
		case State.Running:
			Run( );
			break;
		case State.Jumping:
			Jump( );
			break;
		case State.Falling:
			Fall( );
			break;
		case State.Clinging:
			Cling( );
			break;
		case State.Hanging:
			Hang( );
			break;
		default:
			Debug.Log("Default decision made during FixedUpdate state switch");
			Idle( );
			break;
	}
	lastPosition = position;
	if ( motion.x > vMax.x ) {
		motion.x -= linAccel.x;
	}
	else if ( motion.x < -vMax.x ) {
		motion.x += linAccel.x;
	}
	if ( state != State.Hanging ) {
		rigidbody.velocity = motion;
		velocity = rigidbody.velocity;
		position = transform.position;
	}
	//Debug.Log("Velocity at end of update is "+velocity);
}

// motion action functions
function StartIdle ( ) {
	state = State.Idling;
}
function Idle ( ) {
	switch( xMotion ){
		case XMotion.Right:
			StartWalk( );
			motion.x = linAccel.x;
			break;
		case XMotion.Left:
			StartWalk( );
			motion.x = -linAccel.x;
			break;
		case XMotion.Idling:
			motion.x = 0.0;
			break;
		default:
			Debug.Log("Default decision made during Walk switch");
			motion.x = 0.0;
			break;
	}	
}

function StartWalk ( ) {
	state = State.Walking;
}
function Walk ( ) {
	switch( xMotion ){
		case XMotion.Right:
			if ( Mathf.Abs( motion.x * expAccel.x ) + linAccel.x < vMax.x / 2.0 ) { 
				StartRun( );
				motion.x = motion.x * expAccel.x + linAccel.x;
			}
			break;
		case XMotion.Left:
			if ( Mathf.Abs( motion.x * expAccel.x ) - linAccel.x > -vMax.x / 2.0 ) { 
				StartRun( );
				motion.x = motion.x * expAccel.x - linAccel.x;
			}
			break;
		case XMotion.Idling:
			motion.x = 0.0;
			StartIdle( );
			break;
		default:
			Debug.Log("Default decision made during Walk switch");
			motion.x = 0.0;
			StartIdle( );
			break;
	}
}

function StartRun ( ) {
	state = State.Running;
}
function Run ( ) {
	switch( xMotion ){
		case XMotion.Right:
			if ( Mathf.Abs( velocity.x * expAccel.x ) + linAccel.x <= vMax.x ) {
				motion.x = velocity.x * expAccel.x + linAccel.x;
			}
			else {
				motion.x = vMax.x;
			}
			break;
		case XMotion.Left:
			if ( Mathf.Abs( velocity.x * expAccel.x ) + linAccel.x <= vMax.x ) {
				motion.x = velocity.x * expAccel.x - linAccel.x;
			}
			else {
				motion.x = -vMax.x;
			}
			break;
		case XMotion.Idling:
			motion.x = 0.0;
			StartIdle( );
			break;
		default:
			Debug.Log("Default decision made during Run switch");
			motion.x = 0.0;
			StartIdle( );
			break;
	}
	velocity.x = motion.x;	
}


public var jumps : int = 2;
public var jumpVelocity : float = 2.0;
private var jumpCount : int;

public var jumpTimeOut : float = 0.5;
private var jumpTimer : float;

function StartJump ( ) {
	grounded = false;
	platform = null;
	var octForward : Vector3 = aimController.GetOctForward ( );
	motion += octForward * jumpVelocity;
	velocity += motion;
	jumpCount++;
	jumpTimer = 0.0;
	state = State.Jumping;
	Debug.Log('Jumping at ' + playerForward);
	
	if ( xMotion == XMotion.Left &&  velocity.x > 0  || xMotion == XMotion.Right && velocity.x < 0) {
		velocity.x = -velocity.x;
		motion.x = -motion.x;
	}
}
function Jump ( ) {
	//Debug.Log("In jump, before: "+velocity.y);
	AirMotionHandler();
	var updatedYV : float = velocity.y * expAccel.y - linAccel.y;
	//Debug.Log("new YV is " + updatedYV );
	if( updatedYV <= 0.0 ) {
		StartFall ( );
	}
	motion.y = updatedYV;
	velocity.y = motion.y;
	//Debug.Log("In jump, after: "+velocity.y);
}

function StartFall ( ) {
	state = State.Falling;
}
function Fall ( ) {
	if ( platform != null ) {
		grounded = true;
		jumpCount = 0;
		switch( xMotion ){
			case XMotion.Idling:
				state = State.Idling;
				break;
			case XMotion.Left:
				state = State.Walking;
				break;
			case XMotion.Right:
				state = State.Walking;
				break;
			default:
				Debug.Log("Default decision made during OnCollisionEnter switch");
				state = State.Idling;
				break;
		}
		return;
	}
	AirMotionHandler();
	motion.y = velocity.y * expAccel.y - linAccel.y;
	velocity.y = motion.y;
}

var clingOnTo : GameObject;
function StartCling ( otherObject : GameObject ) {
	clingOnTo = otherObject;
	state = State.Clinging;
	jumpCount = 0;
}
function Cling ( ) {
	motion.y  = velocity.y * expAccel.y - linAccel.y - gripStrength * ( velocity.y * expAccel.y - linAccel.y );
	velocity.y = motion.y;
}

//var hangOnTo : GameObject;
function StartHang ( ) {
	state = State.Hanging;
	//hangOnTo = otherObject;
}
function Hang ( ) {
	//otherObject.SendMessage("Hang");
}

function AirMotionHandler ( ) {
	switch ( xMotion ) {
		case XMotion.Right:
			motion.x = velocity.x * expAccel.x + linAccel.x * airControlFactor;
			break;
		case XMotion.Left:
			motion.x = velocity.x * expAccel.x - linAccel.x * airControlFactor;
			break;
		case XMotion.Idling:
			motion.x = velocity.x;
			break;
		default:
			Debug.Log("Default case reached in AirMotionHandler");
			break;
	}
}

// response to collisions
// this should be the only case where states are potentially updated asynchronously with respect to the motion
function OnCollisionEnter ( collision : Collision ) {
	Debug.Log ( "Collided with " + collision.gameObject.name );
	
    for (var contact : ContactPoint in collision.contacts) {
		Debug.Log ( Vector3.Distance ( contact.point, gameObject.transform.position ) );
    }
	var otherObject : GameObject = collision.gameObject;
	var otherTransform : Transform = collision.transform;
	var otherCollider : Collider = collision.collider;
	var usToThem : Vector3 = otherTransform.position - transform.position;
	
	// if the object is above and we are Jumping, we begin Falling
	var yDiff : float;
	yDiff = usToThem.y;
	if ( state == State.Jumping && otherObject.tag == "Ceiling" ) {
		state = State.Falling;
	}
	else if ( state == State.Falling && otherObject.tag == "Ground" ) {
		//Debug.Log("Trying to ground");
		// touch ground
		grounded = true;
		platform = otherObject;
		jumpCount = 0;
		switch( xMotion ){
			case XMotion.Idling:
				state = State.Idling;
				break;
			case XMotion.Left:
				state = State.Walking;
				break;
			case XMotion.Right:
				state = State.Walking;
				break;
			default:
				Debug.Log("Default decision made during OnCollisionEnter switch");
				state = State.Idling;
				break;
		}
	}
	else if ( state == State.Hanging && otherObject.tag == "Ground" ) {
		grounded = true;
		platform = otherObject;
		jumpCount = 0;
	}
	else if ( ( state == State.Jumping || state == State.Falling ) && otherObject.tag == "Wall" ) {
		// colliding laterally -- TODO: we will add a grab here?
		if( WeCanClingTo( otherObject ) ) {
			StartCling( otherObject );
		}
	}
	else if ( ( state == State.Walking || state == State.Running ) && otherObject.tag == "Wall" ) {
		state = State.Idling;
	}
	else if ( state == State.Clinging && otherObject.tag == "Ground" ) {
		state = State.Idling;
	}
}

function OnCollisionExit ( collision : Collision ) {
	if ( platform && collision.gameObject.name.Equals ( platform.name ) ) {
		grounded = false;
		platform = null;
	}
}

function WeCollideWith ( otherObject : GameObject ) {
	// TODO: define which objects we collide with. probably some kind of public var list
	return true;
}

function WeCanClingTo ( otherObject : GameObject ) {
	return WeCollideWith( otherObject );
}