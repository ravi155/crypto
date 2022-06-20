import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private authKey = 'authenticated';
  private authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get isAuthenticated$(): Observable<boolean> {
    return this.authSub$.asObservable();
  }

  constructor(
    private router: Router
  ) {
    const auth = localStorage.getItem(this.authKey) || null;
    this.authSub$.next( !!JSON.parse(auth) );
  }

  public ngOnDestroy(): void {
    this.authSub$.next(false);
  }

  public login(username: string, password: string): Observable<void> {
    return new Observable( subscriber => {
      this.authSub$.next(true);
      localStorage.setItem(this.authKey, JSON.stringify(true));
      subscriber.complete();
    });
  }

  public logout(redirect: string): Observable<void> {
    return new Observable( subscriber => {
      this.authSub$.next(false);
      localStorage.removeItem(this.authKey);
      this.router.navigate([redirect]);
      subscriber.complete();
    });
  }
}
