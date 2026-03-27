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

    @Column({ type: 'varchar', nullable: true })
    avatarUrl?: string | null;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email!: string;

    @Column({ type: 'varchar', nullable: false })
    hashedPassword!: string;

    @OneToMany(() => Task, task => task.user)
    tasks!: Task[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastLogin!: Date;
}