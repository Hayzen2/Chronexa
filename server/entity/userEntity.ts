import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn  } from 'typeorm';
import { Task } from './taskEntity.ts';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: 'varchar', unique: true })
    username!: string;

    @Column({ type: 'varchar', unique: true })
    displayName!: string;

    @Column({ type: 'varchar', unique: true })
    avatarUrl!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar' })
    hashedPassword!: string;

    @OneToMany(() => Task, task => task.user)
    tasks!: Task[];

    @Column({ type: 'timestamp' })
    lastLogin!: Date;
}