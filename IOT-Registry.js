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
      console.log("DeviceTypes",this.deviceTypes)
   }



   /**
    * @param {any} instanceId
    */
   set deviceInstanceId(instanceId) {
      this.currentInstanceId = instanceId;
   }

   get deviceInstance() {

      const instanceOfId = (value, index, array) => {
         return value.id == this.currentInstanceId;
      }

      return this.deviceInstanses.find(instanceOfId)

   }

   get deviceType() {
      return this.deviceTypes.find(
         type => type.id === this.deviceInstance.type
      );
   }

   get deviceIndex() {
      return this.deviceIndexes;
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
      console.log(indexContainer.tagName)

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

   promptedButtonEntry(promptTxt, value, container) {

      const prompt = this.createElement('label', 'col1-5');
      prompt.innerText = promptTxt;

      const button = this.createElement('button', 'col-last');
      button.innerText = value;
      button.addEventListener("click", (e) => {
         this.busInstanceEntry(this)
      })

      container.append(prompt, button)
   }


   busInstanceEntry(val) {

      function onBusChanged(e) {
         console.log("OnBusChanged", e.target.value)
         e.target.inputElement.value = e.target.value;
      }
      function promptedDropDownEntry(promptTxt, value, container, OptionList) {

         const prompt = val.createElement('label', 'col2-5');
         prompt.innerText = promptTxt;


         const flexRow = val.createElement('div', 'col-last');
         flexRow.style = 'display:flex;flex-direction:row';

         const rowInput = val.createElement('input');
         rowInput.style.width = '70%';
         rowInput.value = value;

         const select = val.createElement('select');
         select.style.width = '30%';
         select.onchange= onBusChanged;
         select.inputElement = rowInput;


         OptionList.forEach(option => {

            const optionElement = val.createElement('option');
            optionElement.value = option
            optionElement.innerText = option
            select.append(optionElement)
         })

         flexRow.append(rowInput, select)

         container.append(prompt, flexRow)
      }


      function promptedButtonEntry(promptTxt, value, container) {


         const prompt = val.createElement('label', 'col2-5');
         prompt.innerText = promptTxt;

         const button = val.createElement('button', 'col-last');
         button.innerText = value;
         button.addEventListener("click", (e) => {
            console.log(`Button pressed ${e}`)
         })

         container.append(prompt, button)

      }


      // this.model.deviceType
      // console.log(deviceType);

      const options = ["Simulated", "Real","Test"]

      promptedDropDownEntry('BusInstance:', 'None', this.instanceContainer, options)
      promptedButtonEntry('Sensors:', ' Add Sensor', this.instanceContainer)
      promptedButtonEntry('Actuators:', ' Add Actuator', this.instanceContainer)

      const divider = val.createElement('hr', 'col-all')
      divider.style.width = "100%";
      this.instanceContainer.append(divider)
   }



   onModeChanged(e) {
      console.log("OnModeChanged", e.target.value)
      e.target.inputElement.value = e.target.value;

   }


   displayDeviceInstances(deviceInstance,deviceType) {
      console.log(deviceInstance)
      console.log(deviceType)

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
      this.ReadOnlyEntryWithPrompt('Type', deviceInstance['type'], this.instanceContainer)
      this.ReadOnlyEntryWithPrompt('Instance', deviceInstance['instance'], this.instanceContainer)

      this.DropDownEntryWithPrompt('Data Mode', deviceInstance['mode'], this.instanceContainer)

      this.promptedButtonEntry('Buses:', ' Add Bus', this.instanceContainer)

      let divider = this.createElement('hr', 'col-all')
      divider.style.width = "100%";
      this.instanceContainer.append(divider)



      const saveButton = this.createElement('button')
      saveButton.innerText = 'Save'
      saveButton.addEventListener("click", this.Save);


      this.app.append(this.instanceContainer, saveButton)




      //   constructor() {
      //    this.id = document.getElementById("id").value;
      //    this.deviceName = document.getElementById("deviceName").value;
      //    this.deviceType = document.getElementById("deviceType").value;
      //    this.deviceInstance = document.getElementById("deviceInstance").value;
      //    this.deviceMode = document.getElementById("mode").value;
      //    this.typeData;
      //    this.busInstances = [];
      //    }
   }


   bindEditDeviceInstance(handler) {

      this.deviceIndexAddressList.forEach(element => {
         element.addEventListener("click", handler);
      });
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

   Save() {
      console.log(" saveButton clicked")
   };

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

   }

   async init() {
      await this.model.init()

      // Display initial deviceIndexes
      this.onDeviceIndexesChanged(this.model.deviceIndex)
      console.log("init()")
      this.view.bindEditDeviceInstance(this.deviceInstanceHandler)
   }

   onDeviceIndexesChanged = deviceIndexes => {
      this.view.displayDeviceIndexes(deviceIndexes)
   }


   deviceInstanceHandler = (e) => {
      this.model.deviceInstanceId = e.currentTarget.value;   
        

      this.view.displayDeviceInstances(this.model.deviceInstance,this.model.deviceType)    // gets current deviceInstance object and display it
   }
}


const app = new Controller(new Model(), new View())


