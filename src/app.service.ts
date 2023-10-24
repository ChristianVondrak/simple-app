import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return{
      
        "name": "Rómulo Rodríguez",
        "emails": [
                "rjrodrig@ucab.edu.ve",
                "rjrodriguezr.12@est.ucab.edu.ve"
        ]
     
}}}
