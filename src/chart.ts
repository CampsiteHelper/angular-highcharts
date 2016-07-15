import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export type Point = number | [number, number] | [string, number] | HighchartsDataPoint;

export interface ChartPoint {
  point: Point;
  serieIndex: number;
}

export type ChartSerie = HighchartsSeriesOptions;

export class Chart {
  pointObservable: Observable<ChartPoint>;
  serieObservable: Observable<ChartSerie>;
  ref: HighchartsChartObject;

  private pointSource: Subject<ChartPoint>;
  private serieSource: Subject<ChartSerie>;

  constructor(public options: HighchartsOptions) {
    // init series array if not set
    if (!this.options.series) {
      this.options.series = [];
    }

    this.pointSource = new Subject();
    this.serieSource = new Subject();
    this.pointObservable = this.pointSource.asObservable();
    this.serieObservable = this.serieSource.asObservable();
  }

  addPoint(point: Point, serieIndex = 0): void {
    let chartPoint: ChartPoint = {
      point: point,
      serieIndex: serieIndex
    };
    (<Point[]>this.options.series[serieIndex].data).push(point);
    this.pointSource.next(chartPoint);
  }

  removePoint(pointIndex: number, serieIndex = 0): void {
    // TODO add try catch (empty)
    (<Point[]>this.options.series[serieIndex].data).splice(pointIndex, 1);
    if (this.ref) {
      this.ref.series[serieIndex].removePoint(pointIndex, true);
    }
  }

  addSerie(serie: ChartSerie): void {
    // init data array if not set
    if (!serie.data) {
      serie.data = [];
    }

    this.options.series.push(serie);
    this.serieSource.next(serie);
  }

  removeSerie(serieIndex: number): void {
    // TODO add try catch (empty)
    this.options.series.splice(serieIndex, 1);
    if (this.ref) {
      this.ref.series[serieIndex].remove(true);
    }
  }
}
