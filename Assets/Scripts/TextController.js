#pragma strict
//import System.Collections.Generic;

var speech : String;
var speechArray : String[];
var speechObjectArray : GameObject[];
var speechAnchor : GameObject;

var speechFont : Font;
var speechFontSize : int;
var speechFontMaterial : Material;

var scrollSpeed : float = 3;

var player : GameObject;
var controller : PlatformInputController;

function Start () {
	//speechArray = new List.<String>();
	player = GameObject.FindGameObjectWithTag('Player');
	controller = player.GetComponent(PlatformInputController);
	speechArray = speech.ToLower().Split(' '[0]);
	speechObjectArray = new GameObject[speechArray.length];
	speechAnchor = new GameObject('Speech Anchor');
	var textMesh : TextMesh;
	var boxCollider : BoxCollider;
	var offsetMarker : int = 0;
	for(var i : int = 0 ; i<speechArray.length ; i++) {
		speechObjectArray[i] = new GameObject(speechArray[i]);
		speechObjectArray[i].transform.parent = speechAnchor.transform;
		speechObjectArray[i].transform.position.x = offsetMarker;
		textMesh = speechObjectArray[i].AddComponent(TextMesh);
		textMesh.font = speechFont;
		//textMesh.anchor = TextAnchor.LowerCenter;
		textMesh.fontSize = speechFontSize;
		textMesh.text = speechArray[i];
		boxCollider = speechObjectArray[i].AddComponent(BoxCollider);
		speechObjectArray[i].AddComponent(MeshRenderer);
		speechObjectArray[i].renderer.materials = [ speechFontMaterial ];
		boxCollider.size = speechObjectArray[i].renderer.bounds.size;
		boxCollider.size.z = 1;
		boxCollider.center = Vector3(speechObjectArray[i].renderer.bounds.size.x/2, -speechObjectArray[i].renderer.bounds.size.y*3/4, 0);
		offsetMarker += speechObjectArray[i].renderer.bounds.size.x + 30;
	}
	speechAnchor.transform.position = player.transform.position - Vector3(0, player.renderer.bounds.size.y/1.5, 0);
}

function Update () {
//	var playerInput : Vector3 = Vector3(0, controller.directionVector.y, 0) - controller.directionVector;
//	speechAnchor.transform.position += playerInput*scrollSpeed;
	
//	var input : Vector3 = Vector3(Input.GetAxis('Horizontal'), 0, 0);
}