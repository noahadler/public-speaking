#pragma strict

public var cursorEffect : Texture;
public var cursorEffectSize : Vector2;
public var player : GameObject;
public var cam : Camera;

private var cursorLoc : Vector2;
private var cursorIcon : ParticleSystem;
private var playerPos : Vector3;
private var forward : Vector3;

function Start ( ) {
	cursorLoc = Vector2.zero;
	playerPos = Vector3.zero;
	forward = Vector3.zero;
	player = GameObject.FindGameObjectWithTag('Player');
	cam = GameObject.FindGameObjectWithTag('MainCamera').GetComponent(Camera);
}

function Update ( ) {
	cursorLoc = Input.mousePosition ;
	if(!player || !cam) {
		player = GameObject.FindGameObjectWithTag('Player');
		cam = GameObject.FindGameObjectWithTag('MainCamera').GetComponent(Camera);
	}
	else {
		playerPos = cam.WorldToScreenPoint( player.transform.position );
		forward = cursorLoc - playerPos;
		forward.Normalize ( );
	}
	//Debug.DrawRay(player.transform.position, difference, Color.white, 100);
	//Debug.Log(playerPos);
	
}

public function GetForward ( ) { return forward; }

public function GetOctForward ( ) {
	var angle : float = Vector3.Angle ( Vector3.up, forward );
	if ( forward.x < 0 ) {
		angle = 360 - angle;
	}
	Debug.Log(angle);
	var newForward : Vector3;
	if ( angle > 22.5 && angle < 67.5 ) {
		newForward = Vector3 ( 1, 1, 0 );
	}
	else if ( angle > 67.5 && angle < 112.5 ) {
		newForward = Vector3 ( 1, 0, 0 );
	}
	else if ( angle > 112.5 && angle < 157.5 ) {
		newForward = Vector3 ( 1, -1, 0 );
	}
	else if ( angle > 157.5 && angle < 202.5 ) {
		newForward = Vector3 ( 0, -1, 0 );
	}
	else if ( angle > 202.5 && angle < 247.5 ) {
		newForward = Vector3 ( -1, -1, 0 );
	}
	else if ( angle > 247.5 && angle < 292.5 ) {
		newForward = Vector3 ( -1, 0, 0 );
	}
	else if ( angle > 292.5 && angle < 337.5 ) {
		newForward = Vector3 ( -1, 1, 0 );
	}
	else if ( angle > 337.5 || angle < 22.5 ) {
		newForward = Vector3 ( 0, 1, 0 );
	}
	newForward.Normalize ( );
	return newForward;
}

function OnGUI ( ) {
    if ( !cursorEffect ){
        Debug.LogError ( "Assign a texture in the inspector." );
        return;
    }
    GUI.DrawTexture( Rect ( cursorLoc.x-cursorEffectSize.x/2, Screen.height-cursorLoc.y-cursorEffectSize.y/2, cursorEffectSize.x, cursorEffectSize.y ), cursorEffect, ScaleMode.ScaleToFit, true, 1.0);
}