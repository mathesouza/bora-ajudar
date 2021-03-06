import React, { Component } from 'react'
import base from '../Base'
import axios from 'axios'
import Select from 'react-select'
import ReactModal from 'react-modal'
// import { auth } from '../../Base' 

const options = [
    { value: '1.00', label: 'R$1,00' },
    { value: '5.00', label: 'R$5,00' },
    { value: '10.00', label: 'R$10,00' }
  ]

class Campaign extends Component {
    constructor(props){
        super(props)
        this.state = {
            campaigns : {},
            redirectDonate: {},
            showModal: false
        }
        this.handleDonate = this.handleDonate.bind(this)
        this._handleChange = this._handleChange.bind(this)
    }
    componentDidMount(){
        base.syncState('campaigns', {
            context: this,
            state: 'campaigns',
            asArray: false
        })
    }
    handleDonate(key){

        this.setState({showModal:true})

        const url = 'https://us-central1-bora-ajudar-73ebc.cloudfunctions.net/api/donate'
        // const url = 'http://localhost:5000/bora-ajudar-73ebc/us-central1/api/donate'
        const dados = {
            valor:this.state.donation,
            nome:this.state.campaigns[key].nome,
            idCampanha: key
        }
        const options = {
            method: 'POST',
            headers: {'Access-Control-Allow-Origin' : '*'},
            data : dados,
            url
        }
        axios(options)
        .then(data=>{
            // console.log(data)
            window.location = data.data.url
        })
        .catch(err =>{
            console.log(err)
        })   

    }
    _handleChange(e){
        this.setState({donation:e.value})
    }
    renderCampaign(key, campaign){
        var percent = (campaign.arrecadado/campaign.meta)*100
         return(
            <section className='page-section' key={key} >
            <div className='container'>
                <div className='product-item bg-faded'>
                <div className='product-item-title d-flex'>
                    <div className='p-5 d-flex mr-auto rounded'>
                    <h2 className='section-heading mb-0'>
                        <span className='section-heading-upper'>{campaign.sub}</span>
                        <span className='section-heading-lower'>{campaign.nome}</span>
                    </h2>
                    </div>
                </div>
                    <div className='product-item-description d-flex ml-auto'>
                        <div className='p-5 rounded'>
                            <p className='mb-0'>{campaign.texto}</p>
                            { campaign.tipo === 'doacao' && 
                                <div>
                                    <div className='progress'>
                                        <div className='progress-bar bg-success' style={{width:''+percent+'%'}} role='progressbar' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'></div>
                                    </div>
                                    <p>Meta: R$ {campaign.meta} / Atingidos: R$ {campaign.arrecadado}</p>
                                        <Select options={options}  onChange={this._handleChange} />
                                    <div>
                                        <button className='btn btn-primary' style={{marginTop:'5px'}} onClick={()=>this.handleDonate(key)}>Contribuir</button>
                                    </div>
                                </div>}
                            { campaign.tipo === 'produtos' &&
                                <div>
                                    <br/>
                                    <h4>Para doar, entre em contato:</h4>
                                    <p>{campaign.contato}</p>
                                </div>
                            }
                        </div> 
                    </div>
                </div>
            </div>
        </section>
         )
    }

    render() {

        return (
            <div>
                <section className='page-section'>
                    <div className='container'>
                        <div className='product-item'>
                        <div className='product-item-title d-flex'>
                            <div className='bg-faded p-5 d-flex ml-auto rounded'>
                            <h2 className='section-heading mb-0'>
                                <span className='section-heading-upper'>Ajude-nos por nossas</span>
                                <span className='section-heading-lower'>Campanhas</span>
                            </h2>
                            </div>
                        </div>
                        <img className='product-item-img mx-auto d-flex rounded img-fluid mb-3 mb-lg-0' src='img/products-01-menor.jpg' alt=''/>
                        <div className='product-item-description d-flex mr-auto'>
                            <div className='bg-faded p-5 rounded'>
                            <p className='mb-0'>Lorem ipsum sagittis consectetur mattis libero hendrerit libero nam, vivamus sem nibh ullamcorper lobortis laoreet inceptos consequat, conubia nisl tempor sapien orci conubia suscipit. pulvinar ullamcorper curabitur senectus eu iaculis laoreet, conubia aliquam gravida ac metus platea proin, dapibus dui malesuada nullam quis. ligula pulvinar tincidunt imperdiet tellus pulvinar justo hac netus, etiam aliquet tellus metus dictum senectus primis tortor eleifend, convallis duis etiam leo rhoncus conubia proin. viverra eget venenatis auctor quisque auctor hendrerit est consequat, praesent convallis class litora lacus ut dictum, pharetra aenean iaculis placerat pulvinar ut volutpat. </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                    <ReactModal 
                        isOpen={this.state.showModal}
                        
                        className="Modal"
                        overlayClassName="Overlay"
                        
                        >
                        <div className="lds-heart" style={{opacity:'1'}}><div></div></div>
                        
                    </ReactModal>
                </section>
                { Object
                    .keys(this.state.campaigns)
                    .map(key =>  this.renderCampaign(key, this.state.campaigns[key]))}
                
            </div>
        )
    }
}
export default Campaign