// This makes the character turn to face the current movement speed per default.
var autoRotate : boolean = true;
var maxRotationSpeed : float = 360;
var xLocked : boolean = true;
private var xLock : float;

private var motor : CharacterMotor;

// Use this for initialization
function Awake () {
	motor = GetComponent(CharacterMotor);
	if(xLocked)
		xLock = transform.position.x;
	else
		xLock = 0;
}

// Update is called once per frame
var directionVector : Vector3;
function Update () {
	// Get the input vector from kayboard or analog stick
	directionVector = new Vector3(Input.GetAxis("Horizontal"), Input.GetAxis("Vertical"), 0);
	
	if (directionVector != Vector3.zero) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		
		// Make sure the length is no bigger than 1
		directionLength = Mathf.Min(1, directionLength);
		
		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;
		
		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
	}
	
	//Debug.Log(directionVector);
	
	// Apply the direction to the CharacterMotor
	//motor.inputMoveDirection = directionVector;
	motor.inputJump = Input.GetButton("Jump");
	//Debug.Log('o net' + (Mathf.Abs(directionVector.x) < 1 ));
	// Set rotation to the move direction	
	if ( autoRotate &&  directionVector.sqrMagnitude > 0.01 ) {
		var newForward : Vector3 = ConstantSlerp(
			transform.forward,
			directionVector,
			maxRotationSpeed * 2 * Time.deltaTime
		);
		newForward = ProjectOntoPlane(newForward, transform.up);
		transform.rotation = Quaternion.LookRotation(newForward, transform.up);
	}
	if ( Mathf.FloorToInt(gameObject.transform.localRotation.eulerAngles.y) == 90
		&& gameObject.transform.localRotation.eulerAngles.y == 270  ) {
		if ( transform.forward.x < 0 ) 
			directionVector = Vector3.left;
		else 
			directionVector = Vector3.right;
	motor.inputMoveDirection = directionVector;
	}
}

function LateUpdate() {
	if(xLocked)
		transform.position.x = xLock;
}

function ProjectOntoPlane (v : Vector3, normal : Vector3) {
	return v - Vector3.Project(v, normal);
}

function ConstantSlerp (from : Vector3, to : Vector3, angle : float) {
	var value : float = Mathf.Min(1, angle / Vector3.Angle(from, to));
	return Vector3.Slerp(from, to, value);
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/Platform Input Controller")
