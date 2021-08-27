import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Campground {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  campground_id: string;

  @Index({ fulltext: true })
  @Column('varchar')
  recarea_name: string;

  @Index({ fulltext: true })
  @Column('varchar')
  name: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column('varchar')
  source: string;
}
