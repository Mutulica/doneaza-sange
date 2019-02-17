import {Injectable, PipeTransform} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {HospitalNotification} from '../models/hospital/notification.model';
import {HospitalAppointment} from '../models/hospital/hospital-appointment.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }


  // GET num of days have passed
  public numDaysBetween(d1): number {
    const d2 = Date.now();
    const diff = Math.abs(d1 - d2);
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays;
  }

  public convertDateToMiliseconds(date: {year: number, month: number, day: number}, time?: string): number {
    if (time) {
      const hoursArr =  time.split(':');
      return  Date.UTC(date.year, date.month - 1, date.day, +hoursArr[0], +hoursArr[1]);
    }
    return Date.UTC(date.year, date.month - 1, date.day);
  }

  public convertTimeToMiliseconds(time: string): number {
    if (time) {
        const hoursArr =  time.split(':');
        return (+hoursArr[0] * 60) + (+hoursArr[1] * 1000);
    }
  }

  public convertToNgbDate(date: number): NgbDate {
    const newDate = new Date(date);
    const ngbDate = {
      year: new Date(newDate).getFullYear(),
      month: new Date(newDate).getMonth() + 1,
      day: new Date(newDate).getDate()
    };
    return ngbDate as NgbDate;
  }

  public getDayOfWeek(date: number): string {
    if (date) {
      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const day = new Date(date).getDay();
      return weekday[day].toLowerCase();
    }
  }

  // Sort array of Obj Descending
  public sortObjDesc(objArr: any[], field: string, order?: 'asc' | 'desc') {
    if (objArr) {
      return objArr.sort((a, b) => {
        if (order === 'asc') {
          return a[field] - b[field];
        }
        return b[field] - a[field];
      });
    }
  }

  // Search in Notifications list
  public searchInObjArray(object: any[], value: string): any[] {
    if (object) {
      return object.filter(el => {
        const term = value.toLowerCase();
        for (const key in el) {
          if (el.hasOwnProperty(key)) {
            if (el[key] !== null && typeof el[key] === 'string' && el[key].toLowerCase().includes(term)) {
              return el;
            }
          }
        }
      });
    }
  }

  // Sort array of Obj Descending NOT WORKING
  public sortTable(objArr: any[], key: string, order?: boolean) {
    if (objArr) {
      return objArr.sort((a, b) => {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }

        const varA = (typeof a[key] === 'string') ?
          a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
          b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA && varB) {
          comparison = 1;
        } else if (varA && varB) {
          comparison = -1;
        }
        return (
          (order) ? (comparison * -1) : comparison
        );
      });
    }
  }

  // Build working schedule between 2 selected hours
  public getTimeBetween(from: string, to: string, offset: number): string[] {
    const timeFromArr = from.split(':');
    const timeToArr = to.split(':');
    let timeFrom = +timeFromArr[0];
    const timeTo = +timeToArr[0];
    let interval = +timeFromArr[1];
    const schedule = [];

    let index = 0;
    while ( timeFrom < timeTo ) {
      if (index === 0) {
        const first = interval === 0 ? '00' : interval;
        schedule.push(`${timeFrom}:${first}`);
        interval += offset;
      }

      if (interval === 60) {
        interval = 0;
        timeFrom++;
        schedule.push(`${timeFrom}:${interval}0`);
      } else {
        schedule.push(`${timeFrom}:${interval}`);
      }
      interval += offset;
      index++;
    }
    return schedule;
  }
}
