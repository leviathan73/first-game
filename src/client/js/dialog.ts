import { debug } from "console";

export class Dialog {
	private _text: string;
	private _modal: any;
	private _lasttime: number;
	private _startTime: number;
	private _active: boolean;
	private _maskingDiv: HTMLDivElement = document.createElement("div");

	public get active(): boolean {
		return this._active;
	}
	public set active(value: boolean) {
		this._active = value;
	}

	private _cb?: Function;
	
	constructor(){
		this._text = ""
		this._modal = false
		this._lasttime = 0
		this._startTime = performance.now();
		this._active = false
		this._cb = undefined
		this._maskingDiv.style.position = "absolute"
		this._maskingDiv.style.width = "100%"
		this._maskingDiv.style.height = "100%"
		this._maskingDiv.style.top = "0"
		this._maskingDiv.style.left = "0"
		this._maskingDiv.style.zIndex = "9999"
		
		document.body.append(this._maskingDiv)		
		this._maskingDiv.addEventListener("keydown", (e)=>{
			if(this.active && this._modal) this.active = false;
		})
	}

	showDialog(text:string, isModal:boolean, shouldLast: number, cb?: Function) {
		this._text = text
		this._modal = isModal
		this._lasttime = shouldLast
		this._startTime = performance.now();
		this._active = true
		this._cb = cb
		this._maskingDiv.style.display = "inline"
		this._maskingDiv.tabIndex = 0
		this._maskingDiv.focus();
	}

	/**
	 * If function returns true it means that player is frozen and shouldn't be animated
	 */
	drawDialog(context: CanvasRenderingContext2D,w:number,h:number): boolean
	{
		const elapsedTime = performance.now() - this._startTime
		if(this._active && (elapsedTime <= this._lasttime || elapsedTime == Infinity))
		{
			context.save()
			context.lineWidth = 1;
			context.fillStyle = "gray";
			context.font = "25px DotsFont";
			let textSize:TextMetrics = context.measureText(this._text)
			context.fillText(this._text, w / 2 - textSize.width/2, h / 2 - 25);
			context.strokeText(this._text, w / 2 - textSize.width/2, h / 2 - 25);
			context.restore()
			return this._modal; 
		} else {
			this._active = false
			this._maskingDiv.style.display = "none"
			if(this._cb) this._cb()
		}
		return false;
	}

}