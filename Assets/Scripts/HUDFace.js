#pragma strict

private var plane : GameObject;
public var textures : Texture[];

function Start () {
	plane = GameObject.Find('HUDFace');
	
}

function Update () {
	var texIndex : int = Mathf.FloorToInt(Random.Range(0,textures.Length));
	renderer.material.mainTexture = textures[texIndex];
}