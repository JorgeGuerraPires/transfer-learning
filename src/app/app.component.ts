import { Component, OnInit } from '@angular/core';

import *as tf from "@tensorflow/tfjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(): void {
    // this.loadmodel();
    // this.loadmodelv2();
  }



  async loadmodelv2() {

    const URL = 'https://teachablemachine.withgoogle.com/models/Sc8mKQsS0/';


    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';


    const model = await tf.loadLayersModel(modelURL);
    model.summary();





    // // Load feature model
    // const tfhubURL =
    //   "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_130_224/feature_vector/3/default/1";
    // const featureModel = await tf.loadGraphModel(tfhubURL, {
    //   fromTFHub: true,
    // });

    // const image: any = document.getElementById('img-id');
    // const imageTensor = tf.browser.fromPixels(image);


    // const featureX = (featureModel.predict(this.preprocess(imageTensor)) as tf.Tensor);


    // // Push data through feature detection
    // console.log(`Features stack ${featureX.shape}`);


  }

  async loadmodel() {

    const model = await tf.loadGraphModel(
      'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_130_224/feature_vector/3/default/1',
      { fromTFHub: true });


    const image: any = document.getElementById('img-id');
    const imageTensor = tf.browser.fromPixels(image);

    const features: any = model.predict(this.preprocess(imageTensor));

    console.log(`Features stack ${features.shape}`);

  }

  preprocess(imageTensor: any) {

    const widthToHeight = imageTensor.shape[1] / imageTensor.shape[0];

    let squareCrop;

    if (widthToHeight > 1) {
      const heightToWidth = imageTensor.shape[0] / imageTensor.shape[1];
      const cropTop = (1 - heightToWidth) / 2;
      const cropBottom = 1 - cropTop;
      squareCrop = [[cropTop, 0, cropBottom, 1]];
    } else {
      const cropLeft = (1 - widthToHeight) / 2;
      const cropRight = 1 - cropLeft;
      squareCrop = [[0, cropLeft, 1, cropRight]];
    }
    // Expand image input dimensions to add a batch dimension of size 1.
    const aux: any = tf.expandDims(imageTensor);

    const crop = tf.image.cropAndResize(
      aux, squareCrop, [0], [224, 224]);
    return crop.div(255);
  }
}
