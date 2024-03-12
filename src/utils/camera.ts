type FacingModeProps = "environment" | "user";

type MediaConstraintsProps = {
  video: VideoConstraintsProps;
  audio: boolean;
};

type VideoConstraintsProps = {
  facingMode: FacingModeProps;
  width?: ResolutionRequestProps;
  height?: ResolutionRequestProps;
};

type ResolutionRequestProps = {
  min?: number;
  max?: number;
  ideal?: number;
};

export default class CameraUtil {
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  customConstraint: MediaConstraintsProps = {} as MediaConstraintsProps;
  devices: Array<unknown> = [];
  stream: MediaStream = {} as MediaStream;

  public constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
  }

  DEFAULT_CONSTRAINT: MediaConstraintsProps = {
    video: {
      facingMode: "user",
    },
    audio: false,
  };

  private constraint(): MediaConstraintsProps {
    if (Object.keys(this.customConstraint).length === 0) {
      return this.DEFAULT_CONSTRAINT;
    } else {
      return this.customConstraint;
    }
  }

  private getDevices(): Promise<Array<unknown>> {
    return new Promise((resolve, reject) => {
      if (this.devices.length > 0) {
        resolve(this.devices);
        return;
      }
      try {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          devices.forEach((device) => {
            if (device.kind && device.kind.toLocaleLowerCase() === "videoinput")
              this.devices.push(device);
          });
        });
        resolve(this.devices);
      } catch (error) {
        console.error("GetDevices", error);
        reject(error);
      }
    });
  }

  public stop() {
    if (!this.video && !(this.video as any)?.srcObject) return;
    if (this.video.srcObject instanceof MediaStream) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } else {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    this.video.srcObject = null;
  }

  private snap(): HTMLCanvasElement {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    const context = this.canvas.getContext("2d");
    context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context?.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    return this.canvas;
  }

  public requestPermission(): Promise<CameraUtil> {
    return new Promise<CameraUtil>((resolve, reject) => {
      try {
        navigator.mediaDevices.getUserMedia(this.constraint()).then(() => {
          resolve(this);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.getDevices().then(() => {
          navigator.mediaDevices.getUserMedia(this.constraint()).then((stream) => {
            this.video.srcObject = stream;
            this.stream = stream;
          });
        });
        resolve();
      } catch (error) {
        console.error("StartAsync", error);
        reject(error);
      }
    });
  }

  public mirror(isMirror: boolean): CameraUtil {
    this.video.style.transform = `scaleX(${isMirror ? "-1" : "1"})`;
    return this;
  }

  public flipCamera(mode?: FacingModeProps): CameraUtil {
    if (mode) {
      this.setConstraint({
        video: {
          ...this.constraint().video,
          facingMode: mode,
        },
        audio: this.constraint().audio,
      });
    } else {
      this.setConstraint({
        video: {
          ...this.constraint().video,
          facingMode: this.constraint().video.facingMode == "user" ? "environment" : "user",
        },
        audio: this.constraint().audio,
      });
    }

    this.stop();

    try {
      this.start();
    } catch (err) {
      console.error("FlipCamera", err);
    }

    return this;
  }

  public snapAsBlob(mime = "image/png") {
    return new Promise((resolve, reject) => {
      try {
        this.snap().toBlob((blob) => resolve(blob), mime, 1);
      } catch (err) {
        console.error("SnapAsBlob", err);
        reject(err);
      }
    });
  }

  public snapAsBase64(mime = "image/png") {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.snap().toDataURL(mime));
      } catch (err) {
        console.error("Snap as b64", err);
        reject(err);
      }
    });
  }

  public setConstraint(constraint: MediaConstraintsProps): CameraUtil {
    this.customConstraint = constraint;
    return this;
  }
}