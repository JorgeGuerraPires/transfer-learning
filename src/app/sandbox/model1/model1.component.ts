import { Component, OnInit, AfterViewInit } from '@angular/core';
import *as tf from "@tensorflow/tfjs";
import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-model1',
  templateUrl: './model1.component.html',
  styleUrls: ['./model1.component.scss']
})

export class Model1Component implements OnInit, AfterViewInit {

  class_1 = [
    "https://pbs.twimg.com/media/DiN41pLXcAEqpXE.jpg",
    "https://live.staticflickr.com/875/26441709537_55a0e4c940_b.jpg",
    "https://t3.ftcdn.net/jpg/02/19/49/54/360_F_219495451_98Y5MB381A7HUxloI3VQSrcQ2lJDnKhm.jpg"
  ];

  class_2 = [
    "https://1.bp.blogspot.com/_AocblBJ6a68/TQfz8-FccTI/AAAAAAAAATg/psI9dr1Rm1U/w1200-h630-p-k-no-nu/ARB_10.JPG",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ2fnd3aQfH4HIthEtTcPxm63q9UbLla4-Ng&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmmMsGAcN2DbPKxhQhKAT9f6hfXgWvhsF99A&usqp=CAU"

  ]

  target = [[0, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 0]]


  ngAfterViewInit() {
    this.run();
    this.loadmodel();

  }

  ngOnInit(): void {

    // this.run();

  }

  async run() {

    const tensors = this.createTensors();
    // console.log(tensors.shape);
    const targetTensor = tf.tensor2d(this.target);

    // console.log(targetTensor.shape);

    //loading feature model
    const featureModel = await tf.loadGraphModel(
      'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_130_224/feature_vector/3/default/1',
      { fromTFHub: true });


    const featureX: any = featureModel.predict(tensors);
    // Push data through feature detection
    console.log(`Features stack ${featureX.shape}`);


    // Create NN
    const transferModel = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [featureX.shape[1]],
          units: 64,
          activation: "relu",
        }),
        tf.layers.dense({ units: 2, activation: "softmax" }),
      ],
    });


    transferModel.compile({
      optimizer: "adam",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    const trainingSurface = { name: 'Loss and MSE', tab: 'Training' };

    await transferModel.fit(featureX, targetTensor, {
      validationSplit: 0.1,
      epochs: 100,
      callbacks: [
        // Show on a tfjs-vis visor the loss and accuracy values at the end of each epoch.
        tfvis.show.fitCallbacks(trainingSurface, ['loss', 'acc', "val_loss", "val_acc"], {
          callbacks: ['onEpochEnd'],
        }),
        { onEpochEnd: console.log },]
    });




  }

  createTensors() {

    let output: any = [];

    this.class_1.map((elem, i) => {
      const image: any = document.getElementById('class-1-' + i);
      const imageTensor = tf.browser.fromPixels(image);
      output.push(imageTensor);

    });


    this.class_2.map((elem, i) => {

      const image: any = document.getElementById('class-2-' + i);
      const imageTensor = tf.browser.fromPixels(image);

      output.push(imageTensor);
    });


    return this.preprocessMany(output);

    // return tf.stack(output);
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


  preprocessMany(imageTensors: any[]) {
    const processedTensors = [];

    for (let i = 0; i < imageTensors.length; i++) {
      const imageTensor = imageTensors[i];
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

      const aux: any = tf.expandDims(imageTensor);
      const crop = tf.image.cropAndResize(aux, squareCrop, [0], [224, 224]);
      const processedTensor = crop.div(255);

      processedTensors.push(processedTensor);
    }

    // Concatenar os tensores processados em um único tensor
    const concatenatedTensor = tf.concat(processedTensors, 0);

    return concatenatedTensor;
  }


}


