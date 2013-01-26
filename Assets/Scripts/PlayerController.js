#pragma strict
var jumpVelocity : int = 30;
var jumpButtonDown : boolean = false;
var jumping : boolean = false;
var jumpCoolDown : float;
//var jump

var extraJumpVelocity : float = 10;
var runMaxVelocity : float = 30;
var airControlFactor : float = 0.75;


function Start () {

}

function Update () {
	var directionVector : Vector3 = new Vector3(Input.GetAxis('Horizontal'), 0, 0);
	if ( Input.GetButton('Jump') )
		jumpButtonDown = true;
	else
		jumpButtonDown = false;
}