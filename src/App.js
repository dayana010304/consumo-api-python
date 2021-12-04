import React from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      _id:'',
      number:'',
      document: '',
      date: '',
      price:'',
      balance: '',
      invoices:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.addInvoice = this.addInvoice.bind(this);
  }

  handleChange(e){
    const { name, value} = e.target;
    this.setState({
      [name]: value
    });
  }

  refreshInvoice(){
    const apiUrl = `http://localhost:5600/invoices`;
    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) =>{
        this.setState({invoices:data});
        console.log(this.state.invoices);
    })
  }

  componentDidMount(){
    this.refreshInvoice();
  }
  addInvoice(e){
    e.preventDefault();
    if (this.state._id){
      fetch(`http://localhost:5600/invoices/${this.state._id.$oid}`,{
        method:'PUT',
        body: JSON.stringify({
          number: this.state.number,
          document: this.state.document,
          date: this.state.date,
          price: this.state.price,
          balance: this.state.balance,
        }),
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({_id:'',number:'', document:'', date:'', price:'', balance:''});
        toast.success("Updated/Saved",{
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose:1000
        })
        this.refreshInvoice();
      });
      
    }
    else{
      fetch(`http://localhost:5600/invoices`,{
        method:'POST',
        body:JSON.stringify(this.state),
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({number:'', document:'', date:'', price:'', balance:''});
        toast.success("Updated/Saved",{
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose:1000
        })
        this.refreshInvoice();
      });
    }
  }

  deleteInvoice(_id){
    if(window.confirm('¿Esta seguro de eliminar la factura?')){
      fetch(`http://localhost:5600/invoices/${_id}`,{
        method:'DELETE',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res=>res.json())
      .then(data =>{
        toast.success("Factura eliminada correctamente...",{
          position: toast.POSITION.TOP_LEFT,
          autoClose:2000
        })
        this.refreshInvoice();
      });
    }
  }

  editInvoice(_id){
    fetch(`http://localhost:5600/invoices/${_id}`)
    .then(res => res.json())
    .then(data =>{
      this.setState({
        number:data.number,
        document:data.document,
        date:data.date,
        price:data.price,
        balance:data.balance,
        _id:data._id
      });
    });
  }

  render(){
    return (
      <div className="container">
        <h1 style={{color:'green'}}>Facturación</h1>
        {/* Formulario*/}
        <form onSubmit={this.addInvoice}>
          <div className="mb-3">
            <label htmlFor="number">Numero de factura</label>
            <input type="number" name="number" className="form-control" 
            onChange={this.handleChange} value={this.state.number}
            placeholder="Numero de factura"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Documento del cliente</label>
            <input type="text" name="document" className="form-control" 
            onChange={this.handleChange} value={this.state.document}
            placeholder="Documento del cliente">
            </input>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Fecha</label>
            <input type="text" name="date" className="form-control" 
            onChange={this.handleChange} value={this.state.date}
            placeholder="Fecha"></input>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Precio</label>
            <input type="text" name="price" className="form-control" 
            onChange={this.handleChange} value={this.state.price}
            placeholder="Precio"></input>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Balance</label>
            <input type="text" name="balance" className="form-control" 
            onChange={this.handleChange} value={this.state.balance}
            placeholder="Balance"></input>
          </div>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
        {/* Fin formulario*/}
        <table className='table table-hover'>
          <thead>
            <tr>
              <th>Id</th>
              <th>N° de factura</th>
              <th>Documento del cliente</th>
              <th>Precio</th>
              <th>Fecha</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.invoices.map(invoice =>{
                return(
                  <tr key={JSON.stringify(invoice._id.$oid)}>
                    <td>{JSON.stringify(invoice._id.$oid)}</td>
                    <td>{invoice.number}</td>
                    <td>{invoice.document}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.price}</td>
                    <td>{invoice.balance}</td>
                    <td>
                      <button onClick={()=>this.editInvoice(invoice._id.$oid)} className="btn btn-primary" style={{margin: '4px'}}>
                      Editar
                      </button>
                      <button onClick={()=>this.deleteInvoice(invoice._id.$oid)} className="btn btn-danger" style={{margin: '4px'}}>
                      Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </div>
    );
  }
}


