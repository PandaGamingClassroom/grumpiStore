import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string>(
    'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp'
  );
  avatar$ = this.avatarSubject.asObservable();

  setAvatar(avatar: string) {
    this.avatarSubject.next(avatar);
    localStorage.setItem('selectedAvatar', avatar);
  }

  loadAvatarFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const savedAvatar = localStorage.getItem('selectedAvatar');
      if (savedAvatar) {
        this.avatarSubject.next(savedAvatar);
      }
    }
  }
}
