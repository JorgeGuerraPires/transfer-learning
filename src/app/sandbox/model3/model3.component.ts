import { Component, OnInit } from '@angular/core';

import *as mobilenet from "@tensorflow-models/mobilenet";
import *as tf from "@tensorflow/tfjs";


import *as knnClassifier from "@tensorflow-models/knn-classifier";


@Component({
  selector: 'app-model3',
  templateUrl: './model3.component.html',
  styleUrls: ['./model3.component.scss']
})
export class Model3Component implements OnInit {

  ngOnInit(): void {

    // this.classify();
    this.run();


  }

  async run() {

    const classifier = knnClassifier.create();
    let mobileNet;

    // Use MobileNet to get features
    mobileNet = await mobilenet.load();

    // Add examples of two classes
    this.addExample('bunny1', 0, classifier, mobileNet);
    this.addExample('bunny2', 0, classifier, mobileNet);
    this.addExample('bunny3', 0, classifier, mobileNet);
    this.addExample('sport1', 1, classifier, mobileNet);
    this.addExample('sport2', 1, classifier, mobileNet);
    this.addExample('sport3', 1, classifier, mobileNet);

    // Moment of truth
    const testImage: any = document.getElementById('test')

    const testFeature = mobileNet.infer(testImage, true);



    const predicted = await classifier.predictClass(testFeature);

    const display: any = document.getElementById("result");

    display.innerText = "Working on it"


    console.log(predicted)

    if (predicted.classIndex === 0) {
      display.innerText = "A Bunny"
    } else {
      display.innerText = "A Sports Car"
    }

    // Moment of truth, round 2
    const testImage_2: any = document.getElementById('test')
    const testFeature_2 = mobileNet.infer(testImage_2, true);



    const predicted_2 = await classifier.predictClass(testFeature_2);

    const display_2: any = document.getElementById("result_2");


    console.log(predicted_2)

    if (predicted_2.classIndex === 1) {
      display_2.innerText = "A Bunny"
    } else {
      display_2.innerText = "A Sports Car"
    }

  }

  addExample(domID: any, classID: any, classifier: any, mobileNet: any) {

    const features = mobileNet.infer(document.getElementById(domID), true);

    classifier.addExample(features, classID);
  }

  async classify() {
    const img: any = document.getElementById('dog');
    // Load the model.
    const model = await mobilenet.load();

    // Classify the image.
    const predictions = await model.infer(img, true);

    console.log('Predictions: ');
    console.log(predictions.shape);

  }


}
