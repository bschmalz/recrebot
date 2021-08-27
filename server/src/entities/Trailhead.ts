import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trailhead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  trail_id: string;

  @Index({ fulltext: true })
  @Column('varchar')
  recarea_name: string;

  @Index({ fulltext: true })
  @Column('varchar')
  district: string;

  @Index({ fulltext: true })
  @Column('varchar')
  name: string;

  @Index({ fulltext: true })
  @Column('varchar')
  facility_name: string;

  @Column('integer')
  facility_id: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column('varchar')
  source: string;
}
