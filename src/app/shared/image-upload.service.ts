import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(
    private afStorage: AngularFireStorage
  ) { }

  async uploadImage(file, userId) {
    const ref = this.afStorage.ref(`profile_images/${userId}`);
    const task = ref.put(file);
    const snapshot = await task.snapshotChanges().toPromise();
    const downloadUrl = await snapshot.ref.getDownloadURL();
    return downloadUrl;
  }
}
