
class DeviceType {

  constructor(typeObject) {
    this.id = typeObject.id
    this.buses = typeObject.buses
    this.pins = typeObject.pins
  }
}

class DeviceInstance {

  constructor( instanceObject,currentType,model) {

    console.log("instanceObject", instanceObject)
    console.log("instanceObject.buses", instanceObject.buses)
    if (instanceObject.buses === undefined) {
      console.log("instanceObject.buses is undefined");
      instanceObject.buses=[]
  }

    this.id = instanceObject.id
    this.name = instanceObject.name
    this.type = instanceObject.type
    this.instance = instanceObject.instance
    this.mode = instanceObject.mode
    this.deviceType = currentType
    this.model = model
    this.buses = []
    console.log("instanceObject.buses",instanceObject.buses)
    instanceObject.buses.forEach(busObject => {
      console.log("busObject",busObject)

      const busInstance = new BusInstance(busObject)
      busInstance.model = this.model
      this.buses.push(busInstance)

      console.log("BusInstance",busInstance)
    });


    console.log("instanceObject", instanceObject)
    console.log("instanceObject.buses", instanceObject.buses)
  
  }
}

class BusType {

  constructor(typeObject) {
    this.id = typeObject.id
    this.pins = typeObject.pins
  }
}
class BusInstance {

  constructor(busInstanceJsonObject) {
    this.type = busInstanceJsonObject.type
    this.instance = busInstanceJsonObject.instance
    this.id = this.type + "." + this.instance
    if(busInstanceJsonObject.pins === undefined) {
      busInstanceJsonObject.pins=[]
      busInstanceJsonObject.sensors=[]
      busInstanceJsonObject.actuators=[]
    }
    this.pins = busInstanceJsonObject.pins
    this.sensors = busInstanceJsonObject.sensors
    this.actuators = busInstanceJsonObject.actuators
  }



  get busType() {
    console.log("get busType")

    const bt = this.model.busTypes.find(
       type => type.id === this.type
    );
    return new BusType(bt)
  }
  get avaliableSensors () {
    console.log("get avaliableSensors")
    console.log("this.type",this.type)
    const sensors = this.model.busToSensors[this.type]
    console.log("get avaliableSensors",sensors)
    return sensors
  }
}

class BusInstancePin {
  constructor(busTypePin) {
    this.name = busTypePin.name
    this.number = null
  }
}

class BusInstanceSensor {
  constructor(busSensorType, instanceNumber) {
    console.log("busSensorType", busSensorType)
    this.type = busSensorType.id
    this.instanceNumber = instanceNumber
    this.id = this.type + "." + instanceNumber
    this.measurands = busSensorType.measurands
    console.log("busSensorType",busSensorType)
  }
}


