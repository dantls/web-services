import { getCustomRepository, IsNull, Repository } from "typeorm";
import { ServicesRepository } from "../repositories/ServicesRepository";
import { Service } from "entities/Service";

class ServicesCreateService {
  private servicesRepository: Repository<Service>
  constructor(){
    this.servicesRepository = getCustomRepository(ServicesRepository);
  }

  async execute(){

    const services = await this.servicesRepository.find({
      where: {
        final_date: IsNull()
      },
      relations: ["order","address","situation"] 
    }) 
    
    const formmatedLists = services.reduce((acc,service) => {
      if(!(acc.find(item => item.title === service.address.description )))
        acc.push({
          title: service.address.description,
          cards: [{
            id: service.id,
            content: service.order.description,
            label: 'green'
          }]
        })   
      else {
        const obj = acc.find(item => item.title === service.address.description)
        obj['cards'].push({
          id: service.id,
          content: service.order.description,
          label: 'green'
        })

      }  
      return acc
         
    },[])
    
      
    return formmatedLists;

  }

}

export default ServicesCreateService 