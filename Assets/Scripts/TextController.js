#pragma strict
//import System.Collections.Generic;
var initialized : boolean = false;

var speech : String;
var speechArray : String[];
var speechObjectArray : GameObject[];
var speechAnchor : GameObject;

var speechFont : Font;
var speechFontSize : int;
var speechFontMaterial : Material;

var scrollSpeed : float = 3;

var player : GameObject;
var nextWord : int;

var gameplay : Gameplay;
var wordMaterial : Material;

function Start () {
	//speechArray = new List.<String>();
	player = GameObject.FindGameObjectWithTag('Player');
	gameplay = GameObject.FindObjectOfType(Gameplay);
	nextWord = 0;
	if (player)
		Init();
}

function Init () {
	//controller = player.GetComponent(PlatformInputController);
	speechArray = speech.ToLower().Split(' '[0]);
	speechObjectArray = new GameObject[speechArray.length];
	speechAnchor = new GameObject('Speech Anchor');
	var textMesh : TextMesh;
	var boxCollider : BoxCollider;
	var offsetMarker : int = 0;
	for(var i : int = 0 ; i<speechArray.length ; i++) {
		speechObjectArray[i] = new GameObject(''+i);
		speechObjectArray[i].transform.parent = speechAnchor.transform;
		speechObjectArray[i].transform.position.x = offsetMarker;
		speechObjectArray[i].transform.rotation.eulerAngles.z = Random.Range(-20.0,20.0);
		speechObjectArray[i].tag = 'Words';
		//speechObjectArray[i].renderer.material = wordMaterial;
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
		offsetMarker += speechObjectArray[i].renderer.bounds.size.x + 20;
		speechObjectArray[i].AddComponent('WordBehavior');
	}
	speechAnchor.transform.position = player.transform.position - Vector3(0, player.renderer.bounds.size.y/1.5, 0);
	initialized = true;
}

function Update () {
	if ( !initialized ) {
		player = GameObject.FindGameObjectWithTag('Player');
		if (player)
			Init();
	}
//	var playerInput : Vector3 = Vector3(0, controller.directionVector.y, 0) - controller.directionVector;
//	speechAnchor.transform.position += playerInput*scrollSpeed;
	
}

function LandedOn( index : int ) : boolean {
	if(nextWord == index){
		nextWord ++;
		gameplay.Relax();
		return true;
	}
	else{
		gameplay.GetNervous();
		nextWord = index+1;
		return false;
	}
}
