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

   get deviceIndex() {
      return this.deviceIndexes;
   }



   async fetchDeviceInstances() {
      let url = "http://localhost:8088/api/devices";
      let msg
      let data
      try {

         const response = await fetch(url)
         msg = await response.json()
         data = await msg.data
         console.log(data)
         return data

      } catch (error) {
         console.log(error)
      }
   }

   async fetchIndexes() {
      let url = "http://localhost:8088/api/deviceIndex";
      let msg
      let data
      try {

         const response = await fetch(url)
         msg = await response.json()
         data = await msg.data
         console.log(data)
         return data

      } catch (error) {
         console.log(error)
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
         // MACAddress.addEventListener("click", function (e) {
         //    console.log(e.currentTarget.innerText);
         //    console.log(`Event target ${e.currentTarget.value}`)
         // });


         MACAddress.innerText = entry.id
         indexContainer.append(deviceName, MACAddress)

      });
      this.app.append(h1, indexContainer)
      console.log(indexContainer.tagName)

   }


   displayDeviceInstances(deviceInstance) {
      console.log(deviceInstance)

      while (this.app.firstChild) {
         this.app.removeChild(this.app.firstChild)
      }

      this.title = this.createElement('h1')
      this.title.textContent = 'IOT Registry'

      const instanceHeader = this.createElement('h1')
      instanceHeader.innerText = "Device Index"


      this.app.append(this.title, instanceHeader)

      const instanceContainer = this.createElement('div', 'instanceContainer')



      // <label class="col1-5" for="id">Id</label><input class="col-last" value={{deviceIndex["id"]}} type="text" name="device_id" id="id" readonly></input>
      // <label class="col1-5" for="deviceName" >Name</label><input class="col-last" value={{deviceIndex["name"]}} type="text" id="deviceName" readonly></input>
      // <label class="col1-5" for="deviceType" >Type</label><input class="col-last" value={{deviceIndex["type"]}} type="text" id="deviceType" readonly></input>
      // <label class="col1-5" for="deviceInstance" >Instance</label><input class="col-last" value={{deviceIndex["instance"]}} type="text"  id="deviceInstance" readonly></input>
  



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
      this.model.deviceInstanceId = e.currentTarget.value;           // sets current instance id
      this.view.displayDeviceInstances(this.model.deviceInstance)    // gets current deviceInstance object and display it
   }
}


const app = new Controller(new Model(), new View())


