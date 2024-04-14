export default class CameraUtil {
  video = null
  canvas = null
  customConstraint = {}
  devices = []
  stream = {}

  constructor(video, canvas) {
    this.video = video
    this.canvas = canvas
  }

  DEFAULT_CONSTRAINT = {
    video: {
      facingMode: "user",
    },
    audio: false,
  }

  constraint() {
    if (Object.keys(this.customConstraint).length === 0) {
      return this.DEFAULT_CONSTRAINT;
    } else {
      return this.customConstraint;
    }
  }

  getDevices() {
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

  stop() {
    if (!this.video && !(this.video)?.srcObject) return;
    if (this.video.srcObject instanceof MediaStream) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } else {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    this.video.srcObject = null;
  }

  snap() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    const context = this.canvas.getContext("2d");
    context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context?.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    return this.canvas;
  }

  requestPermission() {
    return new Promise((resolve, reject) => {
      try {
        navigator.mediaDevices.getUserMedia(this.constraint()).then(() => {
          resolve(this);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  start() {
    return new Promise((resolve, reject) => {
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

  mirror(isMirror) {
    this.video.style.transform = `scaleX(${isMirror ? "-1" : "1"})`;
    return this;
  }

  async flipCamera(mode) {
    if (mode) {
      this.setConstraint({
        video: {
          ...this.constraint().video,
          facingMode: mode,
        },
        audio: this.constraint().audio,
      });
    } else {
      const newFacingMode = this.constraint().video.facingMode == "user" ? "environment" : "user"
      this.mirror(newFacingMode == "user")
      this.setConstraint({
        video: {
          ...this.constraint().video,
          facingMode: newFacingMode,
        },
        audio: this.constraint().audio,
      });
    }

    this.stop();

    try {
      await this.start();
    } catch (err) {
      console.error("FlipCamera", err);
    }

    return this;
  }

  snapAsBlob(mime = "image/png") {
    return new Promise((resolve, reject) => {
      try {
        this.snap().toBlob((blob) => resolve(blob), mime, 1);
      } catch (err) {
        console.error("SnapAsBlob", err);
        reject(err);
      }
    });
  }

  snapAsBase64(mime = "image/png") {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.snap().toDataURL(mime));
      } catch (err) {
        console.error("Snap as b64", err);
        reject(err);
      }
    });
  }

  setConstraint(constraint) {
    this.customConstraint = constraint;
    return this;
  }
}