import fireSoundURL from "../assets/gun2.mp3"
import ufoFireSoundURL from "../assets/gun.mp3"
import explosionSoundURL from "../assets/explode.wav"
import ufoSoundURL from "../assets/ufo.mp3"
import fontURL from "../assets/Codystar-Regular.ttf"
import backgroundMusicURL from "../assets/game-music.mp3"

export enum AssetsTypes {
	FACE_FONT = 0,
	FIRE_SOUND,
	UFO_FIRE_SOUND,
	EXPLOSION_SOUND,
	UFO_SOUND,
	BACKGROUND_MUSIC,
}

export default class Assets {
	constructor() {
	}

	static loadAudioAsset(url: string): Promise<HTMLAudioElement> {
		return new Promise<HTMLAudioElement>((resolve, reject) => {
			const asset = new Audio(url);
			const timerId = setTimeout(reject, 5000, ["resource timeout"])
			asset.addEventListener("canplaythrough", () => {
				clearTimeout(timerId)
				asset.autoplay = false;
				resolve(asset)
			})
		})
	}

	static loadFontAsset(url: string, name: string): Promise<FontFace> {
		return new Promise<FontFace>((resolve, reject) => {
			const asset = new FontFace("DotsFont", `url(${url})`)
			asset.load().then((font) => {
				document.fonts.add(font);
				resolve(asset)
			}).catch((reason) => {
				reject(reason)
			})
		})
	}

	private static assets: any[]

	static get(asset: AssetsTypes): (HTMLAudioElement | FontFace | undefined) {
		return Assets.assets[asset]
	}

	static play(asset: AssetsTypes, from: number = 0, volume: number = 0.1, loop: boolean = false): void {
		let audioAsset: HTMLAudioElement = Assets.get(asset) as HTMLAudioElement
		audioAsset.currentTime = from
		audioAsset.volume = volume;
		audioAsset.loop = loop;
		audioAsset.autoplay = false;
		if (audioAsset instanceof HTMLAudioElement) audioAsset.play()
	}

	static loadAllAssets(): Promise<string> {
		return new Promise((resolve, reject) => {
			Promise.all([
				Assets.loadFontAsset(fontURL, "DotsFont"),
				Assets.loadAudioAsset(fireSoundURL),
				Assets.loadAudioAsset(ufoFireSoundURL),
				Assets.loadAudioAsset(explosionSoundURL),
				Assets.loadAudioAsset(ufoSoundURL),
				Assets.loadAudioAsset(backgroundMusicURL)
			]).then((assets) => {
				Assets.assets = assets
				resolve("ready")
			}).catch((reason) => {
				reject(reason)
			})
		})
	}
}