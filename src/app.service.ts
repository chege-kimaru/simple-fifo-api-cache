import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // assumption, available ram is 1000MB hence only 10 resources can be held at a time

  private _cache: { id: string, resource: string }[] = [];

  async getResourceById(id: string): Promise<string> {
    const item = this._cache.find(item => item.id === id);
    if (item) return item.resource;

    // compute resource
    const resource = await this.calculateResource(id);
    // store resource in cache

    // check size of cache
    if (this._cache.length > 10) {
      // TODO remove least recently used algorithm instead of removing the oldest
      // remove the oldest
      this._cache.shift();
    } else {
      // add to end of array
      this._cache.push({ id, resource: resource });
    }

    return resource;
  }

  getResourceCacheStatus(id: string): { status: string } {
    const resource = this._cache.find(item => item.id === id);
    if (resource) {
      return { status: 'hit' };
    } else {
      return { status: 'miss' };
    }
  }

  async calculateResource(id: string): Promise<string> {
    return new Promise<string>((resolve) => {
      setTimeout(() => { resolve(`resource ${id} contents`); }, 2000);
    })
  }
}
