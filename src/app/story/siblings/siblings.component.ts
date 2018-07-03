import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SiblingsService } from '../../services/siblings.service';


@Component({
  selector: 'app-siblings',
  templateUrl: './siblings.component.html',
  styleUrls: ['./siblings.component.css']
})
export class SiblingsComponent {

  loading: Boolean;
  selectedResource: String;
  selectedUid: String;
  selectedDisplayName: String;
  siblings: Array<any>;
  errorMsg: String;
  defaultProperties: Array<String>;

  constructor(private siblingsService: SiblingsService, private router: Router,
              private route: ActivatedRoute) {
    this.loading = true;
    this.router.events.pipe(filter((event: Event) => event instanceof NavigationEnd)).subscribe(event => {
      this.selectedResource = this.route.snapshot.params['resource'];
      this.selectedUid = this.route.snapshot.params['uid'];
      let last = false;
      if ('last' in this.route.snapshot.queryParams) {
        last = this.route.snapshot.queryParams['last'];
      } else {
        last = false;
      }
      if ('displayName' in this.route.snapshot.queryParams) {
        this.selectedDisplayName = this.route.snapshot.queryParams['displayName'];
      } else {
        this.selectedDisplayName = null;
      }
      this.getSiblings(this.selectedResource, this.selectedUid, last);
    });
  }

  getSiblings(resource: String, uid: String, last: Boolean) {
    this.loading = true;
    this.siblingsService.getSiblings(resource, uid, last).subscribe(
      siblings => {
        if (siblings) {
          this.defaultProperties = this.getDefaultProperties(siblings[0].resource_type);
        }
        this.siblings = siblings;
        this.loading = false;
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
        this.loading = false;
      }
    );
  }

  getDefaultProperties(resource: String) {
    // TODO: Complete me
    switch (resource.toLowerCase()) {
      case ('bugzillabug'):
        return ['id', 'assignee', 'reporter', 'short_description', 'status'];
      case ('distgitcommit'):
        return ['hash', 'author', 'log_message'];
      case ('kojibuild'):
      case ('containerkojibuild'):
        return ['id', 'name', 'version', 'release', 'owner'];
      case ('containeradvisory'):
      case ('advisory'):
        return ['id', 'advisory_name', 'assigned_to', 'security_impact', 'state', 'synopsis'];
      case ('freshmakerevent'):
        return ['id', 'state_name', 'state_reason', 'triggered_container_builds'];
      default:
        return ['id'];
    }
  }
}
