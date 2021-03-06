import {Component} from '@angular/core';
import {Observable} from 'rxjs/rx';
import {Http} from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import {FilterPipe} from './app.supplier.pipe.ts'

var template = `
<input type="text" (input)="search($event.target.value)">

{{address}}
      



  <div class="container">
  <h2>Supplier Information</h2>
  <p>This report displays all the supplier information</p>
    <div class="form-group">
      <input type="text" [(ngModel)]="term" class="form-control" placeholder="Search">
  </div>
  <table class="table">
    <thead>
      <tr>
      <th>Record #</th>
        <th>Name</th>
        <th>eMail</th>
        <th>Phone</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
     <i  [style.visibility]="isLoading ? 'visible' :'hidden'" class="fa fa-spinner fa-spin fa-1x"></i>
      <tr *ngFor="let supplier of suppliers | filter:term let i=index">
      <td>{{i+1}}</td>
        <td>{{supplier.name}}</td>
        <td>{{supplier.email}}</td>
        <td>{{supplier.phone}}</td>
        <td>{{supplier.address}}</td>
      </tr>
    </tbody>
  </table>
</div> 
  

`;

@Component({
selector: 'app-supplier',
template:template,
pipes:[FilterPipe]
})
export class SuppliersComponent{

suppliers: Observable<Array<any>>;
//suppliers: any;

address: Observable<Array<any>>;
urladdress:string;
isLoading:boolean=false;
error:string='';




  constructor (private _http: Http) {
    //this.suppliers = this._http.get('https://jsonplaceholder.typicode.com/users/')
      //.map(response => response.json());
      this.isLoading=true;
      this._http.get('/suppliers.json')
      .map(response => response.json())
      .subscribe(
        result=>this.suppliers=result,
        err=>this.error=err,
          ()=>this.isLoading=false 
      
      );
      
  }

search(searchtext){
    if(searchtext.length<5 || searchtext.length>5  )
    return;

this.urladdress = 'https://maps.googleapis.com/maps/api/geocode/json?address='+searchtext;
console.log(this.urladdress);
   this._http.get(this.urladdress)
                        .map(response => response.json())
                        .debounceTime(300 )
                        .subscribe(
                            (data)=>{this.address=data.results[0].formatted_address},
                            //Displays in case if it hets HTTP error
                            (err)=>{this.address=err}  
                        )
                       
}

}