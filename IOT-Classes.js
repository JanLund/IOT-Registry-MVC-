
class DeviceType {

  constructor(typeObject) {
    this.id = typeObject.id
    this.buses = typeObject.buses
    this.pins = typeObject.pins
  }
}


class DeviceInstance {

  constructor(id, type, name, instance, mode,currentType) {
    this.id = id
    this.name = name
    this.type = type
    this.instance = instance
    this.mode = mode
    this.buses = []
    this.deviceType = currentType
  }
}



class BusType {

  constructor(id) {
    this.id = id
    this.pins = []
  }
}
class BusInstance {

  constructor(id) {
    this.id = id
    this.sensors = []
    this.actuators = []
  }
}