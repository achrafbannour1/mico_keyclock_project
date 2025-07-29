import { Component, OnDestroy, OnInit } from '@angular/core';
import { Resource, ResourceService, Rtype } from "../../../../services/ResourceService/resource.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit, OnDestroy {
  resources: Resource[] = [];
  selectedType: Rtype = Rtype.MACHINE;
  private subscription: Subscription;
  showChatbot: boolean = false; // Initialize as false so the chatbot is hidden by default

  constructor(public resourceService: ResourceService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription = this.resourceService.resources$.subscribe({
      next: (data) => {
        this.resources = data;
      },
      error: (err) => console.error('Error subscribing to resources:', err)
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterByType(type: Rtype): void {
    this.selectedType = type;
  }

  get filteredResources(): Resource[] {
    return this.resources.filter(resource => resource.rtype === this.selectedType);
  }

  isActiveType(type: Rtype): boolean {
    return this.selectedType === type;
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot; // Toggle the visibility of the chatbot
  }

  protected readonly Rtype = Rtype;
}
