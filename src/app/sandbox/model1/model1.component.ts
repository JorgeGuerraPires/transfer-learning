import { Component, OnInit, AfterViewInit } from '@angular/core';
import *as tf from "@tensorflow/tfjs";
import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-model1',
  templateUrl: './model1.component.html',
  styleUrls: ['./model1.component.scss']
})
export class Model1Component implements OnInit, AfterViewInit {

  class_1 = ["https://reptile-database.reptarium.cz/content/photo_rd_14/Oxyrhopus-rhombifer-03000044830_01.jpg",
    "https://live.staticflickr.com/65535/16053639749_cba847f381_b.jpg",
    "data:image/jpeg;base64,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",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUfXVD2tCjs_0LWfM3TwXMNxbuL5FwNfyWq__8RDiOHzMi_5saLC2eAJumxZ6CpzolGPI&usqp=CAU",
    "https://1.bp.blogspot.com/_UebkdiHtT-Q/SPKq1BbMbXI/AAAAAAAAALo/q2OH9KhCyYE/w1200-h630-p-k-no-nu/Oxyrhopus_rhombifer+-+RPPN_Porta_do_C%C3%A9u+-+19.jpg",
    "https://static.inaturalist.org/photos/168350/large.JPG"
  ];

  class_2 = ["https://reptile-database.reptarium.cz/content/photo_rd_02/Erythrolamprus-aesculapii-03000030409_01.jpg",
    "https://www.researchgate.net/profile/Scott-Weinstein/publication/318157776/figure/fig3/AS:610067363659782@1522462802981/The-false-coral-snake-Erythrolamprus-aesculapii-Dipsadidae-an-example-of-a-NFFC_Q320.jpg"
    , "https://c8.alamy.com/comp/W7XFMM/false-coral-snake-erythrolamprus-aesculapii-berbice-river-guyana-september-meetyourneighboursnet-project-W7XFMM.jpg",
    "https://www.ecoregistros.org/site/images/dataimages/2020/02/05/379821/culebra.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpECJmqUhiCTL0_1FpXQW-xRkeVBUzwzwWPQ&usqp=CAU",
    "https://live.staticflickr.com/4089/5151830582_ab60343ccf_z.jpg"

  ]

  target = [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]]

  ngAfterViewInit() {
    this.run();
    // this.loadmodel();
  }

  ngOnInit(): void {

    // this.run();

  }

  async run() {

    const tensors = this.createTensors();
    console.log(tensors.shape);
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
      epochs: 10,
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

      const image: any = document.getElementById('class-1-' + i);
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


