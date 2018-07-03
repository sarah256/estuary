import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class SiblingsService {

  readonly apiUrl: String = environment.api;

  constructor(private http: HttpClient) { }

  getSiblings(resource: String, uid: String, last: Boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}siblings/${resource}/${uid}?last=${last}`);
  }
}
