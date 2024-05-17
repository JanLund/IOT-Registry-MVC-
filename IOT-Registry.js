/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
   constructor() {
      this.currentInstanceId = 'FF:FF:FF:FF:FF:FF';
   }

   async init() {
      this.deviceIndexes = await this.fetchIndexes()
      this.deviceInstanses = await this.fetchDeviceInstances()
      this.deviceTypes = await this.fetchDeviceTypes()
      this.busTypes = await this.fetchBusTypes()
      this.sensorTypes = await this.fetchSensorTypes()

      this.busToSensors = {}
      this.sensorTypes.forEach(st => {
         st.buses.forEach(bus => {
            let busId = Object.keys(bus)[0]
            if (!(busId in this.busToSensors)) {
                 this.busToSensors[busId] = {}
            }
            let sensorValue = {}

            sensorValue["measurands"] = st.measurands
            sensorValue["addresses"] = st.addresses
            sensorValue["id"] = st.id
            this.busToSensors[busId][st.id] = sensorValue
         })
      })
      console.log("busSensorDic", this.busToSensors)
      // console.log("indexOf", this.deviceInstanses.indexOfId(this.currentInstanceId))
      // console.log("deviceInstanses", this.deviceInstanses)
      // console.log("DeviceTypes", this.deviceTypes)
      // console.log("BusTypes", this.busTypes)
      // console.log("SensorTypes", this.sensorTypes)


   }

   _commit(deviceInstance) {
      console.log('_commit')
      this.onDeviceInstanceChanged(deviceInstance, this.deviceType)
   }


   // --------------------------bindings-----------------------------

   bindDeviceInstanceChanged(callback) {
      this.onDeviceInstanceChanged = callback
   } sensors

   bindDeviceIndexesChanged(callback) {
      this.onDeviceIndexesChanged = callback
   }



   // --------------------------handlers--------------------------

   handleCurrentIndexChange = (value) => {
      this.currentIndex = value
      console.log(`model.currentIndex =  ${this.currentIndex}`)
      console.log(`deviceInstance =  ${this.deviceInstance['name']}`)

      let currentType = new DeviceType(this.deviceType)
      console.log("currentType", currentType)

      // this.currentInstance = new DeviceInstance(this.deviceInstance['id'], this.deviceInstance['type'], this.deviceInstance['name'], this.deviceInstance['instance'], this.deviceInstance['mode'], currentType)
      this.currentInstance = new DeviceInstance(this.deviceInstance, currentType,this)

      console.log("currentInstance", this.currentInstance)

      this._commit(this.currentInstance)

   }

   addBus = () => {
      const noneObject = {type:"none",instance:this.currentInstance.buses.length}
      let bus = new BusInstance(noneObject)
      // let bus = new BusInstance("none", this.currentInstance.buses.length)
      bus.model = this
      this.currentInstance.buses.push(bus)
      console.log("model.addBus")
   }

   addSensor = (bus) => {
      let sensor = new BusInstanceSensor(bus.avaliableSensors["none"], bus.sensors.length)
      console.log("sensor", sensor)
      bus.sensors.push(sensor)
      console.log("bus", bus)
      console.log("model.addSensor")
   }



   /**
    * @param {any} instanceId
    */
   set deviceInstanceId(instanceId) {
      this.currentInstanceId = instanceId;
   }

   get deviceInstance() {
      return this.deviceInstanses.find(
         instance => instance.id === this.currentIndex
      );
   }

   get deviceType() {
      return this.deviceTypes.find(
         type => type.id === this.deviceInstance.type
      );
   }

   get deviceIndex() {
      return this.deviceIndexes;
   }


   async fetchSensorTypes() {
      const url = "http://localhost:8088/api/sensorTypes";
      try {

         const response = await fetch(url)
         const msg = await response.json()
         const data = await msg.data
         return data

      } catch (error) {
         console.error(error);
         throw error;
      }
   }

   async fetchBusTypes() {
      const url = "http://localhost:8088/api/busTypes";
      try {

         const response = await fetch(url)
         const msg = await response.json()
         const data = await msg.data
         return data

      } catch (error) {
         console.error(error);
         throw error;
      }
   }

   async fetchDeviceTypes() {
      const url = "http://localhost:8088/api/deviceTypes";
      try {

         const response = await fetch(url)
         const msg = await response.json()
         const data = await msg.data
         return data

      } catch (error) {
         console.error(error);
         throw error;
      }
   }


   async fetchDeviceInstances() {
      const url = "http://localhost:8088/api/devices";
      try {

         const response = await fetch(url)
         const msg = await response.json()
         const data = await msg.data
         console.log(data)
         return data

      } catch (error) {
         console.error(error);
         throw error;
      }
   }

   async fetchIndexes() {
      const url = "http://localhost:8088/api/deviceIndex";
      try {
         const response = await fetch(url);
         const msg = await response.json()
         const data = await msg.data;
         return data;
      } catch (error) {
         console.error(error);
         throw error;
      }
   }

    async Save() {
      console.log("model.Save()")

      const di = this.currentInstance

      const data = {
         "id": di.id,
         "name": di.name,
         "type": di.type,
         "instance": di.instance,
         "mode": di.mode,
         "buses": di.buses
      }

      data.buses.forEach((bus => {
         delete bus.model
      }))

      console.log("data = ", data)


      const response = await fetch('http://localhost:8088/api/devices', {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      });

      const jsonData = await response.json();
      console.log(jsonData);
   };


}

/**
* @class View
*
* Visual representation of the model.
*/
class View {
   constructor() {
      this.app = this.getElement('#root')

      // this.deviceIndexPage = this.createDeviceIndexPage()

      // this.form = this.createElement('form')
      // this.input = this.createElement('input')
      // this.input.type = 'text'
      // this.input.placeholder = 'Edit Instance'
      // this.input.name = 'action'
      // this.submitButton = this.createElement('button')
      // this.submitButton.textContent = 'Submit'
      // this.form.append(this.input, this.submitButton)

      this.title = this.createElement('h1')
      this.title.textContent = 'IOT Registry'


      this.app.append(this.title)

      this._temporaryTodoText = ''

      this._initLocalListeners()
   }

   // ----------------------------------------------------------------




   // ----------------------------------------------------------------
   bindDeviceIndexesChanged(callback) {
      this.onDeviceIndexesChanged = callback
   }

   bindEditDeviceInstance(handler) {

      this.deviceIndexAddressList.forEach(element => {
         element.addEventListener("click", handler);
      });
   }

   bindCurrentIndexChanged(handler) {
        this.deviceIndexAddressList.forEach(element => {
         element.addEventListener("click", handler);
      });
   }

   bindEditDeviceInstance(handler) {

      this.deviceIndexAddressList.forEach(element => {
         element.addEventListener("click", handler);
      });
   }
   bindModeChanged(handler) {
      this.onModeChanged = handler;
   }

   bindBusTypeChanged(handler) {
      this.onBusTypeChanged = handler;
   }

   bindBusPinChanged(handler) {
      this.onBusPinChanged = handler;
   }

   bindSensorTypeChanged(handler) {
      this.onSensorTypeChanged = handler
   }

   bindAddBus(handler) {
      this.onAddBus = handler
   }

   bindAddSensor(handler) {
      this.onAddSensor = handler
   }

   bindSave(handler) {
      this.onSave = handler
   }

   // ------------------------------------------------------------------------
   get deviceIndexAddressList() {
      return Array.from(document.getElementsByClassName("deviceIndexAddress"))
   }


   displayDeviceIndexes(deviceIndexes) {

      const h1 = this.createElement('h1')
      h1.innerText = "Device Index"
      const indexContainer = this.createElement('div', 'indexContainer')

      const nameHeader = this.createElement('div')
      nameHeader.innerText = "Name";

      const macHeader = this.createElement('div')
      macHeader.innerText = "MAC Address";


      indexContainer.append(nameHeader, macHeader)

      deviceIndexes.forEach(entry => {

         const deviceName = this.createElement('label')
         deviceName.innerText = entry.name
         deviceName.classList.add("deviceIndexName")
         const MACAddress = this.createElement('div')
         MACAddress.classList.add("deviceIndexAddress")
         MACAddress.value = entry.id

         MACAddress.innerText = entry.id
         indexContainer.append(deviceName, MACAddress)

      });
      this.app.append(h1, indexContainer)
   }

   ReadOnlyEntryWithPrompt(promptTxt, value, container) {
      const prompt = this.createElement('label', 'col1-5');
      prompt.innerText = promptTxt;

      const input = this.createElement('input', 'col-last')
      input.value = value;
      input.readOnly = true;
      container.append(prompt, input)
   }

   DropDownEntryWithPrompt(promptTxt, value, container) {

      const prompt = this.createElement('label', 'col1-5');
      prompt.innerText = promptTxt;


      const flexRow = this.createElement('div', 'col-last');
      flexRow.style = 'display:flex;flex-direction:row';

      const rowInput = this.createElement('input');
      rowInput.style.width = '70%';
      rowInput.value = value;

      const select = this.createElement('select');
      select.style.width = '30%';
      select.onchange = this.onModeChanged;
      select.inputElement = rowInput;

      const option1 = this.createElement('option');
      option1.value = 'Simulated'
      option1.innerText = 'Simulated'

      const option2 = this.createElement('option');
      option2.value = 'Real'
      option2.innerText = 'Real'

      select.append(option1, option2)
      flexRow.append(rowInput, select)

      container.append(prompt, flexRow)
   }

   promptedButtonEntry(promptTxt, value, container, clickHandler) {

      const prompt = this.createElement('label', 'col1-5');
      prompt.innerText = promptTxt;

      const button = this.createElement('button', 'col-last');
      button.innerText = value;
      // button.addEventListener("click", this.onAddBus)
      button.addEventListener("click", clickHandler)

      container.append(prompt, button)
   }


   displayDeviceInstance(deviceInstance) {

      let busInstanceEntry = (bus) => {

         let promptedDropDownEntry = (promptTxt, value, container, OptionList) => {

            const prompt = this.createElement('label', 'col2-5');
            prompt.innerText = promptTxt;


            const flexRow = this.createElement('div', 'col-last');
            flexRow.style = 'display:flex;flex-direction:row';

            const rowInput = this.createElement('input');
            rowInput.style.width = '70%';
            rowInput.value = bus.id;

            const select = this.createElement('select');
            select.style.width = '30%';
            select.onchange = this.onBusTypeChanged;
            select.inputElement = rowInput;
            select.bus = bus

            OptionList.forEach(option => {

               const optionElement = this.createElement('option');
               optionElement.value = option
               optionElement.innerText = option
               select.append(optionElement)
            })
            select.value = bus.type


            flexRow.append(rowInput, select)

            container.append(prompt, flexRow)
         }

         let promptedButtonEntry = (promptTxt, value, container, clickHandler, target) => {
            const prompt = this.createElement('label', 'col2-5');
            prompt.innerText = promptTxt;

            const button = this.createElement('button', 'col-last');
            button.innerText = value;
            button.object = target
            button.addEventListener("click", clickHandler)

            container.append(prompt, button)
         }


         let measurandHeaderElement = (container) => {


            const measurandHeaderElement = document.createElement("div");
            measurandHeaderElement.classList.add("selectObject.id" + ".Measurands");
            measurandHeaderElement.classList.add("col-last");
            measurandHeaderElement.classList.add("measurand");
            measurandHeaderElement.style = "display:flex;flex-direction:row";
            measurandHeaderElement.style.border = "1px solid";
            measurandHeaderElement.style.backgroundColor = "white";

            const nameElement = document.createElement("div");
            nameElement.innerText = "Name";
            nameElement.style.width = "40%";

            const quantityElement = document.createElement("div");
            quantityElement.innerText = "Quantity";
            quantityElement.style.width = "30%"

            const unitElement = document.createElement("div");
            unitElement.innerText = "Unit";
            unitElement.style.width = "30%"

            measurandHeaderElement.appendChild(nameElement);
            measurandHeaderElement.appendChild(quantityElement);
            measurandHeaderElement.appendChild(unitElement);

            container.append(measurandHeaderElement)
            // parent.parentNode.insertBefore(measurandHeaderElement, parent.nextSibling);

         }

         let measurandElement = (m, container) => {
            let measurandElement = document.createElement("div");
            // measurandElement.classList.add(selectObject.id + ".Measurands");
            measurandElement.classList.add("col-last");
            measurandElement.style = "display:flex;flex-direction:row";

            const prompt = document.createElement("div");
            prompt.innerText = m.name;
            prompt.style.width = "40%"
            prompt.classList.add("measurand");

            const measurand = document.createElement("div");
            measurand.innerText = m.quantity;
            measurand.style.width = "30%"
            measurand.classList.add("measurand");

            const unit = document.createElement("div");
            unit.innerText = m.unit;
            unit.style.width = "30%"
            unit.classList.add("measurand");

            measurandElement.appendChild(prompt);
            measurandElement.appendChild(measurand);
            measurandElement.appendChild(unit);

            container.append(measurandElement)

            // parent.parentNode.insertBefore(measurandElement, parent.nextSibling);
         }

         const sensorElement = (sensor, bus, parent) => {

            let sensorLabelElement = document.createElement('label');
            sensorLabelElement.innerText = "Sensor:";
            sensorLabelElement.className = "col3-5";


            let SensorInstanceInputElement = document.createElement('input');
            SensorInstanceInputElement.type = "text"
            SensorInstanceInputElement.value = sensor.id;
            SensorInstanceInputElement.id = "instanceInputId";
            SensorInstanceInputElement.style.width = "70%";
            SensorInstanceInputElement.readOnly = true;

            let SensorInstanceSelectElement = document.createElement('select'); sensor

            SensorInstanceSelectElement.onchange = this.onSensorTypeChanged;
            SensorInstanceSelectElement.bus = bus
            SensorInstanceSelectElement.sensor = sensor

            SensorInstanceSelectElement.style.width = "30%";
            SensorInstanceSelectElement.inputElement = SensorInstanceInputElement;

            console.log("bus", bus)

            console.log("avaliableSensors", bus.avaliableSensors)

            for (const [key] of Object.entries(bus.avaliableSensors)) {
               console.log(key);
               let optionElement = document.createElement("option");
               if (key == sensor.type) { optionElement.selected = true }
               optionElement.innerText = key;
               SensorInstanceSelectElement.appendChild(optionElement);
            }


            console.log("SensorInstanceSelectElement", SensorInstanceSelectElement);

            let SensorInstanceDiv = document.createElement('div');
            SensorInstanceDiv.style = "display:flex;flex-direction:row";
            SensorInstanceDiv.className = "col-last";
            SensorInstanceDiv.appendChild(SensorInstanceInputElement);
            SensorInstanceDiv.appendChild(SensorInstanceSelectElement);

            parent.appendChild(SensorInstanceDiv)


            if (sensor.measurands.length > 0) measurandHeaderElement(parent)
            sensor.measurands.forEach(m => {
               measurandElement(m, parent)
            })
         }




         const options = ["none"]
         deviceInstance.deviceType.buses.forEach(bt => {
            options.push(bt.name)
         })

         promptedDropDownEntry('BusInstance:', bus.type, this.instanceContainer, options)

         // Add Pin entries according to current bus spec
         bus.pins.forEach((pin) => {
            let testDiv = document.createElement("div");
            testDiv.classList.add("test");
            testDiv.classList.add("col-last");
            testDiv.style = "display:flex;flex-direction:row";

            const prompt = document.createElement("div");
            prompt.innerText = "pin:";
            prompt.style.width = "15%"

            let div1 = document.createElement("div");
            div1.innerText = pin.name;
            div1.style.width = "25%"

            let input = document.createElement("input");
            input.placeholder = "number";
            if (pin.number != null) input.value = pin.number
            input.style.width = "60%"
            input.addEventListener("change", this.onBusPinChanged);
            input.pin = pin

            testDiv.appendChild(prompt);
            testDiv.appendChild(div1);
            testDiv.appendChild(input);

            this.instanceContainer.append(testDiv)

         })

         promptedButtonEntry('Sensors:', ' Add Sensor', this.instanceContainer, this.onAddSensor, bus)

         // Add Sensor Entry
         console.log("Bus", bus)
         bus.sensors.forEach(sensor => {
            sensorElement(sensor, bus, this.instanceContainer)
         })

         promptedButtonEntry('Actuators:', ' Add Actuator', this.instanceContainer)

         const divider = this.createElement('hr', 'col-all')
         divider.style.width = "100%";
         this.instanceContainer.append(divider)
      }

      function displayBus(bus) {
         console.log("Bus.id =", bus.id)
         busInstanceEntry(bus)
      }

      console.log(deviceInstance)

      while (this.app.firstChild) {
         this.app.removeChild(this.app.firstChild)
      }

      this.title = this.createElement('h1')
      this.title.textContent = 'IOT Registry'

      const instanceHeader = this.createElement('h1')
      instanceHeader.innerText = "Device Instance"


      this.app.append(this.title, instanceHeader)

      this.instanceContainer = this.createElement('div', 'instanceContainer')


      this.ReadOnlyEntryWithPrompt('Id', deviceInstance['id'], this.instanceContainer)
      this.ReadOnlyEntryWithPrompt('Name', deviceInstance['name'], this.instanceContainer)
      this.ReadOnlyEntryWithPrompt('TypeName', deviceInstance['type'], this.instanceContainer)
      this.ReadOnlyEntryWithPrompt('Instance', deviceInstance['instance'], this.instanceContainer)

      this.DropDownEntryWithPrompt('Data Mode', deviceInstance['mode'], this.instanceContainer)

      this.promptedButtonEntry('Buses:', ' Add Bus', this.instanceContainer, this.onAddBus)

      let divider = this.createElement('hr', 'col-all')
      divider.style.width = "100%";
      this.instanceContainer.append(divider)

      deviceInstance.buses.forEach(bus => { displayBus(bus); })

      const saveButton = this.createElement('button')
      saveButton.value = deviceInstance
      saveButton.innerText = 'Save'
      saveButton.addEventListener("click", this.onSave);

      this.app.append(this.instanceContainer, saveButton)
   }


   createElement(tag, className) {
      const element = document.createElement(tag)

      if (className) element.classList.add(className)

      return element
   }

   getElement(selector) {
      const element = document.querySelector(selector)

      return element
   }

   _initLocalListeners() {
      // this.todoList.addEventListener('input', event => {
      //    if (event.target.className === 'editable') {
      //       this._temporaryTodoText = event.target.innerText
      //    }
      // })
   }

   // ---------------------
}

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class Controller {
   constructor(model, view) {
      this.model = model
      this.view = view
      this.init()

   } sensor

   async init() {
      await this.model.init()

      // Display initial deviceIndexes
      this.onDeviceIndexesChanged(this.model.deviceIndex)

      // ----------------------------------------------------------
      this.model.bindDeviceIndexesChanged(this.onDeviceIndexesChanged);
      this.model.bindDeviceInstanceChanged(this.onDeviceInstanceChanged)
      this.view.bindCurrentIndexChanged(this.onCurrentIndexChanged);
      this.view.bindModeChanged(this.onModeChanged)
      this.view.bindBusTypeChanged(this.OnBusTypeChanged)
      this.view.bindBusPinChanged(this.OnBusPinChanged)
      this.view.bindAddBus(this.onBusAdded)
      this.view.bindAddSensor(this.onSensorAdded)
      this.view.bindSensorTypeChanged(this.onSensorTypeChanged)
      this.view.bindSave(this.onSave)


      // ----------------------------------------------------------



   }

   onDeviceIndexesChanged = (deviceIndexes) => {
      console.log(`onDeviceIndexesChanged ${deviceIndexes}`)
      this.view.displayDeviceIndexes(deviceIndexes)
   }

   onCurrentIndexChanged = (e) => {
      console.log(`onCurrentIndexChanged.`)
      this.handleCurrentIndexChange(e.currentTarget.value)
   }


   onDeviceInstanceChanged = (device) => {

      console.log("onDeviceInstanceChanged instance ", device)

      this.view.displayDeviceInstance(device)
   }

   onModeChanged(e) {
      console.log("OnModeChanged", e.target.value)
      e.target.inputElement.value = e.target.value;

   }

   OnBusTypeChanged = (e) => {
      console.log("OnBusTypeChanged", e.target.value)

      let busInstance = e.target.bus
      busInstance.pins.length = 0;
      busInstance.sensors.length = 0;
      busInstance.type = e.target.value;
      busInstance.id = e.target.value + "." + e.target.bus.instance;
      e.target.inputElement.value = busInstance.id;

      busInstance.busType.pins.forEach(p => {
         let pin = new BusInstancePin(p)
         busInstance.pins.push(pin)
      })

      console.log("OnBusTypeChanged busInstance", busInstance)

      this.view.displayDeviceInstance(this.model.currentInstance);
   }

   OnBusPinChanged = (e) => {

      e.target.pin.number = e.target.value;

      console.log("OnBusPinChanged pin", e.target.pin)

      console.log("OnBusPinChanged device ", this.model.currentInstance)

      // this.view.displayDeviceInstance();
   }


   onSensorTypeChanged = (e) => {
      console.log("onSensorTypeChanged", e.target.value)
      console.log("bus", e.target.bus)
      console.log("sensor", e.target.sensor)


      const sensorType = e.target.bus.avaliableSensors[e.target.value]
      console.log("sensorType", sensorType)

      e.target.sensor.type = e.target.value
      e.target.sensor.id = e.target.sensor.type + "." + e.target.sensor.instanceNumber
      e.target.sensor.measurands = sensorType.measurands

      console.log("sensor", e.target.sensor)
      console.log("bus", e.target.bus)
      this.view.displayDeviceInstance(this.model.currentInstance);
   }

   onBusAdded = (e) => {

      this.model.addBus()
      console.log("currentInstance.buses", this.model.currentInstance.buses)
      this.view.displayDeviceInstance(this.model.currentInstance);
   }

   onSensorAdded = (e) => {
      this.model.addSensor(e.target.object)
      console.log("controller.onSensorAdded", e.target.object)
      this.view.displayDeviceInstance(this.model.currentInstance);
   }

   onSave = async () => {
      console.log("controller.onSave")
      await this.model.Save()
   }

   // -----------------------------------
   handleCurrentIndexChange = (value) => {
      this.model.handleCurrentIndexChange(value)
   }
   // -
}

const app = new Controller(new Model(), new View())
