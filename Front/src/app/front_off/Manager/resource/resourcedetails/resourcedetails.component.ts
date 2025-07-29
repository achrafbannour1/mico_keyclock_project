import {Component, OnInit} from '@angular/core';
import {Resource, ResourceService} from "../../../../services/ResourceService/resource.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-resourcedetails',
  templateUrl: './resourcedetails.component.html',
  styleUrls: ['./resourcedetails.component.css']
})
export class ResourcedetailsComponent implements OnInit {
  resource!: Resource;

  constructor(
    private route: ActivatedRoute,
    public resourceService: ResourceService
  ) {}

  ngOnInit(): void {
    this.loadResource();
  }

  loadResource(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.resourceService.getResourceById(id).subscribe({
        next: (data) => (this.resource = data),
        error: (err) => console.error('Error loading resource details:', err),
      });
    }
  }
}
