import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    readonly APIUrl = "http://127.0.0.1:8000";
    readonly PhotoUrl = "http://127.0.0.1:8000/media/";

    constructor(private http: HttpClient) { }

    getDepList(): Observable<any[]> {
        return this.http.get<any[]>(this.APIUrl + '/department/');
    }

    addDepartment(val: any) {
        return this.http.post(this.APIUrl + '/department/', val);
    }

    updateDepartment(val: any) {
        return this.http.put(this.APIUrl + '/department/', val);
    }

    deleteDepartment(val: any) {
        return this.http.delete(this.APIUrl + '/department/' + val);
    }

    getUserList(): Observable<any[]> {
        return this.http.get<any[]>(this.APIUrl + '/user/');
    }

    addUser(val: any) {
        return this.http.post(this.APIUrl + '/user/', val);
    }

    updateUser(val: any) {
        return this.http.put(this.APIUrl + '/user/', val);
    }

    deleteUser(val: any) {
        return this.http.delete(this.APIUrl + '/user/' + val);
    }

    UploadPhoto(val: any) {
        return this.http.post(this.APIUrl + '/SaveFile', val);
    }

    getAllDepartmentNames(): Observable<any[]> {
        return this.http.get<any[]>(this.APIUrl + '/department/');
    }
}
