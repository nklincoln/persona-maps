export class Aspect {

  private name: string;
  private confidence;

  constructor(name: string, confidence) {
    this.name = name;
    this.setConfidence(confidence);
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setConfidence(confidence) {
    if(confidence>=-1 && confidence<=5) {
      this.confidence = confidence;
    } else {
      throw Error('Confidence must be between -1 and 5.')
    }
  }

  getConfidence() {
    return this.confidence;
  }

}
