import { Component, OnInit, AfterViewInit } from '@angular/core';

import *as tf from "@tensorflow/tfjs";
import * as tfvis from '@tensorflow/tfjs-vis';


@Component({
  selector: 'app-model2',
  templateUrl: './model2.component.html',
  styleUrls: ['./model2.component.scss']
})
export class Model2Component implements OnInit, AfterViewInit {

  class_1 = [
    "https://pbs.twimg.com/media/DiN41pLXcAEqpXE.jpg",
    "https://live.staticflickr.com/875/26441709537_55a0e4c940_b.jpg",
    "https://minio.scielo.br/documentstore/0101-8175/cHbkZ9C7XgrkN9QFnsj3TfK/e4b1da048238d46c1ded5983cb70b72aa52bdeec.jpg",
    "https://thumbs.dreamstime.com/z/serpente-cruzada-de-pit-viper-bothrops-alternatus-na-terra-73746501.jpg"


  ];

  class_2 = [
    "https://1.bp.blogspot.com/_AocblBJ6a68/TQfz8-FccTI/AAAAAAAAATg/psI9dr1Rm1U/w1200-h630-p-k-no-nu/ARB_10.JPG",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ2fnd3aQfH4HIthEtTcPxm63q9UbLla4-Ng&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8l2mmwCqBLt2ox62zFq28V-lNe3lWUnMsnw&usqp=CAU",
    "https://www.schpost.com.br/arquivos_personalizados/uploads/noticias/fotos/bec84ebd02264c7191b261c1332915b2_6213ac65a597e.jpg"

  ]

  target = [[0, 1], [0, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 0], [1, 0]]

  ngAfterViewInit(): void {
    this.loadmodel();
  }

  ngOnInit(): void {
    // this.loadmodel();
  }


  async loadmodel() {

    const featureModel = await tf.loadLayersModel('./assets/mobilenet/model.json');
    console.log('ORIGINAL MODEL');
    // featureModel.summary();

    //
    const lastLayer = featureModel.getLayer('conv_pw_13_relu');

    const shavedModel = tf.model({
      inputs: featureModel.inputs,
      outputs: lastLayer.output,
    })
    console.log('SHAVED DOWN MODEL')
    // shavedModel.summary();


    const tensors = this.createTensors();
    const targetTensor = tf.tensor2d(this.target);

    console.log('Target tensors')
    targetTensor.print();


    const featureX: any = shavedModel.predict(tensors);
    // Push data through feature detection
    console.log(`Features stack ${featureX.shape}`);


    // Create NN
    const transferModel = tf.sequential({
      layers: [
        tf.layers.flatten({ inputShape: featureX.shape.slice(1) }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 2, activation: 'softmax' }),
      ],
    })

    transferModel.compile({
      optimizer: "adam",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    const trainingSurface = { name: 'Loss and MSE', tab: 'Training' };

    await transferModel.fit(featureX, targetTensor, {
      validationSplit: 0.1,
      epochs: 10,
      callbacks: [
        // Show on a tfjs-vis visor the loss and accuracy values at the end of each epoch.
        tfvis.show.fitCallbacks(trainingSurface, ['loss', 'acc', "val_loss", "val_acc"], {
          callbacks: ['onEpochEnd'],
        }),
        { onEpochEnd: console.log },]
    });

    // const image: any = document.getElementById("pred_1");
    // const imageTensor = tf.browser.fromPixels(image);

    const image: any = document.getElementById('pred_1');
    const imageTensor = tf.browser.fromPixels(image);

    const feature_pred: any = shavedModel.predict(this.preprocess(imageTensor));
    console.log(`Features stack ${feature_pred.shape}`);

    const pred: any = transferModel.predict(feature_pred);
    pred.print();

    // const pred: any = await transferModel.predict(imageTensor);
    // pred.print();

    const image_2: any = document.getElementById('pred_2');
    const imageTensor_2 = tf.browser.fromPixels(image_2);

    const feature_pred_2: any = shavedModel.predict(this.preprocess(imageTensor_2));
    // console.log(`Features stack ${feature_pred.shape}`);

    const pred_2: any = transferModel.predict(feature_pred_2);
    pred_2.print();

    // combine the models
    const combo = tf.sequential()
    combo.add(shavedModel)
    combo.add(transferModel)

    combo.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })
    combo.summary();




  }


  createTensors() {

    let output: any = [];

    this.class_1.map((elem, i) => {
      const image: any = document.getElementById('class-1-' + i);
      const imageTensor = tf.browser.fromPixels(image);
      output.push(imageTensor);

    });


    this.class_2.map((elem, i) => {

      const image: any = document.getElementById('class-1-' + i);
      const imageTensor = tf.browser.fromPixels(image);
      output.push(imageTensor);
    });


    return this.preprocessMany(output);

    // return tf.stack(output);
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
