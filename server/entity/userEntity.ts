import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany  } from 'typeorm';
import { Task } from './taskEntity.ts';

@Entity()
export class User {
    @PrimaryColumn("uuid")
    id!: string

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    displayName!: string;

    @Column({ unique: true })
    avatarUrl!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    hashedPassword!: string;

    @OneToMany(() => Task, task => task.userId)
    tasks!: Task[];

    @Column()
    lastLogin!: Date;
}