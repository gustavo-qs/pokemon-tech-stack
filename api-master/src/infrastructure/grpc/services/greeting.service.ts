import { Observable } from 'rxjs';

export interface GreeterService {
  sayHello(data: { name: string }): Observable<{ message: string }>;
}
